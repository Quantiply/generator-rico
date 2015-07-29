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

        var prompts = [];
        // {
        //         name: 'appName',
        //         message: 'What is your app\'s name ?'
        //     }];

        this.prompt(prompts, function(props) {
            this.props = props;
            // To access props later use this.props.someOption;
            this.appName = props.appName;

            done();
        }.bind(this));
    },

    writing: {
        app: function() {

            console.log("Creating a scafold in the current dir....");

            this.directory(this.templatePath(), ".");

            // this.directory(this.templatePath("bin"), "bin");
            // this.fs.copy(
            //   this.templatePath('_package.json'),
            //   this.destinationPath('package.json')
            // );
            // this.fs.copy(
            //   this.templatePath('_bower.json'),
            //   this.destinationPath('bower.json')
            // );
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