var path = require('path');
var slugify = require('slugify');
var mkdirp = require('mkdirp');
var dateFormat = require('dateformat');

var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  
  constructor(args, opts) {
    super(args, opts);
    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

    this.option('skip-install', {
      desc: 'Skips installing dependencies',
      type: Boolean
    });
  }

  initializing() {
    this.projectConfig = require('./templates/project.config.json');
  }

  prompting() {
    var dateString = dateFormat(new Date(), 'yyyy-mm-dd')
    const questions = [
      {
        type: 'input',
        name: 'title',
        message: 'Welcome to your new interactive. What will we call it?',
        default: this.appname
      },
      {
        type: 'confirm',
        name: "gitInit",
        message: "Initialize empty git repository?",
        default: true
      }
    ];

    this.prompt(questions).then((answers) => {
      this.meta = {
        ['gitInit']: answers.gitInit,
        ['googleAnalyticsCategory']: slugify(this.appname) + '-v1.0',
        ['isFullbleed']: this.projectConfig.isFullbleed,
        ['name']: this.appname,
        ['s3bucket']: 'graphics.axios.com',
        ['s3folder']: slugify(this.appname),
        ['slug']: slugify(this.appname),
        ['appleFallback']: `fallbacks/${slugify(this.appname)}-apple.png`,
        ['newsletterFallback']: `fallbacks/${slugify(this.appname)}-fallback.png`,
      };
    });
  }

  configuring() {
    console.log(this.meta)

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
  }

  install() {
    this.installDependencies({
      yarn: true,
      npm: false,
      bower: false,
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });
  }

  end() {
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

};
