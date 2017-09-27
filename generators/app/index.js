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
        name    : 'byline',
        message : "Whose name(s) should appear on the byline? You can list names separated with a comma, and edit this in project.config.json",
        default : "Axios"
      },{
        type    : 'input',
        name    : 'title',
        message : "What's the title? You can edit this in project.config.json",
        default : this.appname
      },{
        type    : 'input',
        name    : "sourceName",
        message : "What's the data source(s)? You can list sources separated with a comma, and edit this in project.config.json",
        default : 'Axios'
      },{
        type    : 'input',
        name    : "sourceUrl",
        message : "What's the data source url(s)? You can list source urls separated with a comma, and edit this in project.config.json",
        default : 'https://axios.com'
      }, {
        type    : 'confirm',
        name    : "isFullbleed",
        message : "Do you want this graphic to be a fullbleed embed (no margins or padding)?",
        default : false
      }]).then(function(answers, err) {
        done(err);
        this.meta = {};
        // default info
        this.meta.name = this.appname;
        this.meta.slug = slugify(this.appname);
        this.meta.s3bucket = "graphics.axios.com";
        this.meta.s3folder = dateString + '-' + slugify(this.appname);
        this.meta.googleAnalyticsCategory = dateString + '-' + slugify(this.appname) + '-v1.0';
        this.gitInit = true;

        // variable info
        this.meta.byline = answers.byline;
        this.meta.title = answers.title;
        this.meta.sourceName = answers.sourceName;
        this.meta.sourceUrl = answers.sourceUrl;
        this.meta.isFullbleed = answers.isFullbleed;
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
    this.spawnCommand('git', ['init'])
    this.log(endMessage)
  }
});
