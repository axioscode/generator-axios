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
      var prompts = [{
        type    : 'list',
        name    : 'headline',
        message : 'Pick your headline:',
        choices : [
          'Headline A (Accent Border)',
          'Headline B (Accent Header)',
          'Headline C (All Text)',
          'Headline D (Header Image)'
        ],
        default : 'Headline C (All Text)'
      },{
        type    : 'checkbox',
        name    : 'components',
        message : 'Which components do you need?',
        choices : [
          { name: 'One column text data point' },
          { name: 'Two column text data points' },
          { name: 'One column graphic data point' },
          { name: 'Two column graphic data points' },
          { name: 'Text block' },
          { name: 'Highlighted text'}
        ]
      }];
      this.prompt(prompts).then(function(answers, err) {
        done(err);
        this.meta = {};
        this.meta.headline = answers.headline;
        console.log("components", answers.components);
        this.meta.components = answers.components;
        this.meta.slug = slugify(this.appname);
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
    this.log(endMessage)
  }
});
