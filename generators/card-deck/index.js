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
        name    : 'slug',
        message : 'Project Slug:',
        default : slugify(this.appname)      // Default to current folder name
      },{
        type    : 'input',
        name    : 'description',
        message : 'Project Slug:',
        default : 'An interactive card deck for axios.com'      // Default to current folder name
      },{
        type    : 'list',
        name    : 'docType',
        message : 'Using a Google Doc or Spreadsheet?',
        choices : ["sheet", "doc"],
        default : 'sheet'      // Default to spreadsheet
      },{
        type    : 'input',
        name    : 'fieldId',
        message : 'Google Drive ID',
        default : '1k91vZX2Gg8sLPNPX1Q6rzaomIQM_s3Ol8zUVsAEpQFI'  // Default to blank spreadsheet with the proper headers
      },{
        type    : 'input',
        name    : 's3bucket',
        message : 'Project S3 Bucket:',
        default : 'graphics.axios.com'      // Default to current folder name
      },{
        type    : 'input',
        name    : 's3folder',
        message : 'Project S3 Folder:',
        default : dateString + '-' + slugify(this.appname)      // Default to current folder name
      },{
        type    : 'input',
        name    : 'googleAnalyticsCategory',
        message : 'A new, unique Google Analytics event category name:',
        default : dateString + '-' + slugify(this.appname) + '-v0.1'      // Default to current folder name
      },{
        type    : 'confirm',
        name    : 'gitInit',
        message : 'Initialize empty git repository:',
        default : true,
      }]).then(function(answers, err) {
        this.meta = {};
        this.meta.name = answers.name;
        this.meta.slug = answers.slug;
        this.meta.description = answers.description;
        this.meta.s3bucket = answers.s3bucket;
        this.meta.s3folder = answers.s3folder;
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
