var slugify = require('slugify');
var Generator = require('yeoman-generator');

module.exports = class extends Generator{
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
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
    this.pkg = require('../../package.json');
    this.projectConfig = require('./templates/project.config.json');
  }

  prompting() {
    var done = this.async();
    return this.prompt([{
      type    : 'confirm',
      name    : "gitInit",
      message : "Initialize empty git repository?",
      default : true
    }]).then((answers, err) => {
      done(err);
      this.meta = {
        ['gitInit']: answers.gitInit,
        ['googleAnalyticsCategory']: slugify(this.appname) + '-v1.0',
        ['isFullbleed']: this.projectConfig.isFullbleed,
        ['name']: this.appname,
        ['s3bucket']: 'graphics.axios.com',
        ['s3folder']: slugify(this.appname),
        ['slug']: slugify(this.appname),
        ['appleFallback']: `fallbacks/${slugify(this.appname)}-apple.png`,
        ['newsletterFallback']: `fallbacks/${slugify(this.appname)}-fallback.png`
      };
    });
  }

  configuring() {
    // Copy all the dotfiles.
    this.fs.copy(
      this.templatePath("**/.*"),
      this.destinationRoot()
    );

    // Copy all the normal files.
    this.fs.copy(
      this.templatePath("**/*"),
      this.destinationRoot()
    );

    // Copy over templated files
    // webpack
    this.fs.copyTpl(
      this.templatePath("**/*.js"),
      this.destinationRoot(),
      { meta: this.meta }
    );

    // project.config.json
    this.fs.copyTpl(
      this.templatePath("**/*.json"),
      this.destinationRoot(),
      { meta: this.meta }
    );

    // readme
    this.fs.copyTpl(
      this.templatePath("**/*.md"),
      this.destinationRoot(),
      { meta: this.meta }
    );
  }

  install() {
    this.installDependencies({
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
    `;
    if (this.meta.gitInit) {
      this.spawnCommand('git', ['init']);
    }
    this.log(endMessage);
  }
};
