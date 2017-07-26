'use strict';
var path = require('path');
var slugify = require('slugify');
var mkdirp = require('mkdirp');
var dateFormat = require('dateformat');

var Generator = require('yeoman-generator');

module.exports = Generator.extend({
  constructor: function () {
    Generator.apply(this, arguments);

    this.option('analytics', {
      desc: 'Specifying AnalyticsDB will configure VPC settings for the analytics database',
      type: String,
      required: false
    });

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
        this.meta.analytics = this.options.analytics? true : false;
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
  end: function() {
    this.log("Success! Welcome to your new lambda apex project. Next steps are:\n")
    this.log("1. Make sure you have awscli and Apex installed\n")
    this.log("\t> aws --help")
    this.log("\t> apex --help")
    this.log("\n2. If either command errors, run the following command:\n")
    this.log("\t> ./setup.sh\n")
    this.log("3. Create Python or Node.js functions for your project:\n")
    this.log("\t> yo axios:lambda-node <function name>\n")
    this.log("OR...\n")
    this.log("\t> axios:lambda-python <function name>")
  }
});
