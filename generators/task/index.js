'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

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
            // To access props later use this.props.someOption;
            // this.appName = props.appName;
            done();
        }.bind(this));
    },

    writing: function() {
        // this.directory(this.templatePath(""), "bin");

        var splitClassName = this.props.className.split(".");
        if (splitClassName.length < 2) {
            var err = chalk.red.bold('\nNo package name for [ ' + this.props.className + ' ].Package name is required for task class.');
            this.log(err);
            return;
        };

        var dir = "app";
        if (splitClassName.length > 2) {
            var packageName = this.props.className.split(".").slice(0, -2).join("/");
            dir = "app/" + packageName;
            mkdirp(dir);
            this.fs.copy(
                this.templatePath('__init__.py'),
                this.destinationPath(dir + "/__init__.py")
            );
        }

        var that = this;
        var parseTopicList = function(topicListStr) {
            that.log(topicListStr);
            return topicListStr.split(",")
            .map(function(topic) { return topic.trim(); })
            .filter(function(topic) { that.log(topic); return topic.length > 0 });
        };
        var inTopics = parseTopicList(this.props.kafkaInputs);
        var outTopics = parseTopicList(this.props.kafkaOutputs);

        var context = {
            taskName: splitClassName[splitClassName.length - 1]
        };
        this.template("_task.py", dir + "/" + splitClassName[splitClassName.length - 2] + ".py", context);
        
        var cfgTemplate = this.read("_jobs.yml");
        
        this.log(inTopics.map(function(topic) {return "kafka." + topic;}).join(","));
        var context = {
            task_name: this.props.className,
            job_name: this.props.jobName,
            samza_task_inputs: inTopics.map(function(topic) {return "kafka." + topic;}).join(","),
            task_output: outTopics[0]
        };
        var cfg = this.engine(cfgTemplate, context);
        var taskConfigPrompt = chalk.yellow.bold('\nPlease add this config to config/jobs.yml : \n \n');
        this.log(taskConfigPrompt + cfg);
    }
});