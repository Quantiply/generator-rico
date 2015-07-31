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
            }
        ];
        this.prompt(prompts, function(props) {
            this.props = props;
            done();
        }.bind(this));
    },

    writing: {
        app: function() {
            this.log("Creating scaffolding in the current dir for project " + this.props.projectName + "...");

            this.directory(this.templatePath(), ".");
            this.template('bin/pom.xml', 'bin/pom.xml', this.props);
        }


    },

    install: function() {
        // this.installDependencies();
        var howToInstall =
            '\nPlease run ' +
            chalk.yellow.bold('pip install -r bin/rico-requirements.txt') +
            ' to install the rico dependencies.' +
            '\nThen run the following to setup the rico enviornment:' +
            '\n' + chalk.yellow.bold('. bin/activate') +
            '\n' + chalk.yellow.bold('rico build jar');

        this.log(howToInstall);

    }
});