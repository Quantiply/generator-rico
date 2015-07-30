'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _ = require('lodash');

var parseTopicList = function(topicListStr) {
    return topicListStr.split(",")
    .map(function(topic) { return topic.trim(); })
    .filter(function(topic) { return topic.length > 0 });
};


module.exports = yeoman.generators.Base.extend({    
    prompting: function() {
        var done = this.async();

        this.log('Generate scaffold for ' + chalk.red('Rico') + ' task! \n');

        var prompts = [{
            name: 'jobName',
            message: 'What job does this task belong to ?'
        }, {
            name: 'className',
            message: 'What is your task\'s (fully qualified) class name ?'
        }, {
            name: 'kafkaInputs',
            message: 'What Kafka topic(s) does this task read from ?'
        }, {
            name: 'kafkaOutputs',
            message: 'What Kafka topic(s) does this task write to ?'
        }];

        this.prompt(prompts, function(props) {
            this.props = props;
            this.props.inTopics = parseTopicList(this.props.kafkaInputs);
            this.props.outTopics = parseTopicList(this.props.kafkaOutputs);
            // To access props later use this.props.someOption;
            // this.appName = props.appName;
            var topicsNeedingNicknames = [];
            if (this.props.inTopics.length > 1) {
                topicsNeedingNicknames = topicsNeedingNicknames.concat(this.props.inTopics);
            }
            if (this.props.outTopics.length > 1) {
                topicsNeedingNicknames = topicsNeedingNicknames.concat(this.props.outTopics);
            }
            
            if (topicsNeedingNicknames.length > 0) {
                var prompts = topicsNeedingNicknames.map(function(topic) {
                    return {name: topic, message: "Nickname for topic: " + topic + ": ", default: topic};
                });
                this.prompt(prompts, function(props) {
                    this.props.nicknames = props;
                    done();
                }.bind(this));
            }
            else {
                this.props.nicknames = [];
                done();
            }
        }.bind(this));
    },

    writing: function() {
        // this.directory(this.templatePath(""), "bin");

        var props = this.props;
        this.log(props);

        var splitClassName = props.className.split(".");
        if (splitClassName.length < 2) {
            var err = chalk.red.bold('\nNo package name for [ ' + props.className + ' ].Package name is required for task class.');
            this.log(err);
            return;
        };

        var dir = "app";
        if (splitClassName.length > 2) {
            var packageName = props.className.split(".").slice(0, -2).join("/");
            dir = "app/" + packageName;
            mkdirp(dir);
            this.fs.copy(
                this.templatePath('__init__.py'),
                this.destinationPath(dir + "/__init__.py")
            );
        }

        var topicNames = _.map(props.nicknames, function (nickname, topic) {
            return {topic: topic, nickname: nickname};
        });
        var inTopicNames = topicNames.filter(function (name) {
            return _.includes(props.inTopics, name.topic);
        });
        inTopicNames.forEach(function(name) {
            name.processFunc = _.camelCase("process_" + name.nickname + "_msg");
        });
        var outTopicNames = topicNames.filter(function (name) {
            return _.includes(props.outTopics, name.topic);
        });
        if (outTopicNames.length ==- 0 && props.outTopics.length === 1) {
            outTopicNames = [{topic: props.outTopics[0], nickname: "out"}];
        }

        var context = {
            taskName: splitClassName[splitClassName.length - 1],
            inTopicNames: inTopicNames,
            outTopicNames: outTopicNames
        };
        this.template("_task.py", dir + "/" + splitClassName[splitClassName.length - 2] + ".py", context);

        var cfgTemplate = this.read("_jobs.yml");
        var context = {
            taskName: props.className,
            jobName: props.jobName,
            inTopicNames: inTopicNames,
            outTopicNames: outTopicNames,
            samzaTaskInputs: props.inTopics.map(function(topic) {return "kafka." + topic;}).join(",")
        };
        var cfg = this.engine(cfgTemplate, context);
        var taskConfigPrompt = chalk.yellow.bold('\nPlease add this config to config/jobs.yml : \n \n');
        this.log(taskConfigPrompt + cfg);
    }
});