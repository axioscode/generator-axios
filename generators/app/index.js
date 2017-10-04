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

    this.hasAuthor = this.config.get('authorName') ? true : false;
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
        name    : "authorName",
        message : "What's your name?",
        default : 'Axios',
        when    : () => this.hasAuthor === false
      }, {
        type    : 'confirm',
        name    : "gitInit",
        message : "Initialize empty git repository?",
        default : true
      }]).then(function(answers, err) {
        done(err);
        if (this.hasAuthor === false) {
          // todo: set config globally, not locally, for all generated projects
          this.config.set('authorName', answers.authorName);
        }
        this.meta = {
          ['name']: this.appname,
          ['slug']: slugify(this.appname),
          ['authorName']: this.config.get('authorName'),
          ['s3bucket']: 'graphics.axios.com',
          ['s3folder']: dateString + '-' + slugify(this.appname),
          ['googleAnalyticsCategory']: dateString + '-' + slugify(this.appname) + '-v1.0',
          ['gitInit']: answers.gitInit
        };
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
    var endMessage = `
  Nice! You're ready to start making an Axios interactive!
  Start by writing code into files in the src/ director

  1. Add data from Google Drive, docs or spreadsheets:

    > gulp gdrive:add
    > gulp gdrive:fetch

  2. Preview it locally on browsers and devices to make sure it looks ok:

    > gulp serve

  3. Troubleshooting? Check the logs when you compile everything:

    > gulp build

  4. Publish!

    > gulp publish
    `
    if (this.gitInit) {
      this.spawnCommand('git', ['init'])
    }
    this.log(endMessage)
  }
});
