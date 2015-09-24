'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var jsyaml = require('js-yaml');
var wiring = require("html-wiring");

var parseTopicList = function(topicListStr) {
    return topicListStr.split(",")
    .map(function(topic) { return topic.trim(); })
    .filter(function(topic) { return topic.length > 0 });
};


module.exports = yeoman.generators.Base.extend({    
    prompting: function() {
        var done = this.async();

        this.log('Generate scaffold for ' + chalk.red('Rico') + ' elasticsearch! \n');

        var prompts = [
            {
                name: 'jobName',
                message: 'What name to you want for the job ?'
            }, 
            {
                name: 'kafkaInputs',
                message: 'What Kafka topic(s) does this task read from ?'
            }
        ];

        this.prompt(prompts, function(props) {
            this.props = props;
            this.props.inTopics = parseTopicList(this.props.kafkaInputs);

            var prompts = this.props.inTopics.map(function(topic) {
                return {name: topic, message: "Nickname for topic: " + topic + ": ", default: topic};
            });
            this.prompt(prompts, function(props) {
                this.props.nicknames = props;
                done();
            }.bind(this));
        }.bind(this));
    },

    writing: function() {
        var props = this.props;

        var inTopicNames = _.map(props.nicknames, function (nickname, topic) {
            return {topic: topic, nickname: nickname};
        });

        var cfgTemplate = this.read("_jobs.yml");
        var context = {
            jobName: props.jobName,
            inTopicNames: inTopicNames,
            esStreams: _.pluck(inTopicNames, 'nickname'),
            samzaTaskInputs: "someShit,otherThing"
            // samzaTaskInputs: props.inTopics.map(function(topic) {return "kafka." + topic;}).join(",")
        };
        var jobCfg = jsyaml.load(this.engine(cfgTemplate, context));
        var existingCfg = jsyaml.load(wiring.readFileAsString("config/jobs.yml")) || {};
        this.log('Merging into config/jobs.yml...');
        this.write("config/jobs.yml", jsyaml.dump(_.merge(existingCfg, jobCfg)));
        this.log('Start elasticsearch and run ' + chalk.yellow.bold('rico samze ' + props.jobName) + ' to test');
    }
});