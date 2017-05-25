'use strict';
var path = require('path');
var slugify = require('slugify');
var mkdirp = require('mkdirp');
var dateFormat = require('dateformat');

var Generator = require('yeoman-generator');

module.exports = Generator.extend({
  constructor: function () {
    Generator.apply(this, arguments);

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

    this.option('skip-install', {
      desc: 'Skips installing dependencies',
      type: Boolean
    });
  },

  initializing: function () {
    this.pkg = require('../../package.json');
  },

  prompting: {
    meta: function() {
      var done = this.async();
      var dateString = dateFormat(new Date(), 'yyyy-mm-dd')
      this.prompt([{
        type    : 'input',
        name    : 'name',
        message : 'Project Name:',
        default : this.appname      // Default to current folder name
      },{
        type    : 'input',
        name    : 'description',
        message : 'Project Description:',
        default : this.appname      // Default to current folder name
      },{
        type    : 'input',
        name    : 'timeout',
        message : 'Timeout integer, in seconds, before function is terminated. Defaults to 30:',
        default : 30    // Default to current folder name
      },{
        type    : 'confirm',
        name    : 'gitInit',
        message : 'Initialize empty git repository:',
        default : true,
      }]).then(function(answers, err) {
        this.meta = {};
        this.meta.name = answers.name;
        this.meta.description = answers.description;
        this.meta.timeout = answers.timeout;
        this.gitInit = answers.gitInit;
        done(err);
      }.bind(this));
    }
  },

  configuring: function() {
    // Copy all the normal files.
    this.fs.copyTpl(
      this.templatePath("**/*"),
      this.destinationRoot(),
      { meta: this.meta }
    );

    // Copy all the dotfiles.
    this.fs.copyTpl(
      this.templatePath("**/.*"),
      this.destinationRoot(),
      { meta: this.meta }
    );
  },
  install: function () {
    this.installDependencies({
      bower: false,
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });
  },
  end: function() {
    if (this.gitInit) {
      this.spawnCommand('git', ['init'])
    }
  }
});
