'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
    prompting: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the outstanding ' + chalk.red('Rico') + ' generator!'
        ));

        var prompts = [
            {
                name: 'projectName',
                message: 'What is your project name ?'
            },
            {
                name: 'useCustomMavenRepo',
                message: 'Use a custom maven repo?',
                type: 'confirm',
                'default': false
            },
            {
                name: 'useElasticsearch',
                message: 'Will this project load data into Elasticsearch?',
                type: 'confirm',
                'default': false
            }
            
        ];
        this.prompt(prompts, function(props) {
            this.props = props;

            if (this.props.useCustomMavenRepo) {
                var mavenPrompts = [
                    {
                        name: 'mavenCentralMirror',
                        message: 'What is the url of your mirror of Maven Central?'
                    },
                    {
                        name: 'quantiplyMirror',
                        message: 'What is the url of your mirror of Quantiply Maven Repo?'
                    }
                ];
                this.prompt(mavenPrompts, function(props) {
                    this.props.customRepos = props;
                    done();
                }.bind(this));
            }
            else {
                done();
            }
        }.bind(this));
    },

    writing: {
        app: function() {
            this.log("Creating scaffolding in the current dir for project " + this.props.projectName + "...");

            this.directory(this.templatePath(), ".");
            this.template('bin/pom.xml', 'bin/pom.xml', this.props);
            this.template('bin/yarn-src.xml', 'bin/yarn-src.xml', this.props);
        }


    },

    install: function() {
        // this.installDependencies();
        this.log('\nPlease run ' + chalk.yellow.bold('pip install -r bin/rico-requirements.txt')
            + ' to install the dependencies for the rico script.');
        this.log('Run ' + chalk.yellow.bold('. bin/activate') + ' to setup environment varibles');
        this.log('Add pip dependencies needed by the job in app/requirements.txt');
        this.log('Run ' + chalk.yellow.bold('rico install-deps') + ' to install job dependencies');
        this.log('Run ' + chalk.yellow.bold('rico build') + ' to build an uber-jar of java dependencies');
        this.log('Run ' + chalk.yellow.bold('yo rico:task') + ' to generate a job task skeleton');
    }
});