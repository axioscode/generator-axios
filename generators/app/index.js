let slugify = require("slugify");
let Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.pkg = require("../../package.json");
    this.projectConfig = require("./templates/project.config.json");
  }

  prompting() {
    let done = this.async();
    return this.prompt([
      {
        type: "confirm",
        name: "gitInit",
        message: "Initialize empty git repository?",
        default: true,
      },
    ]).then((answers, err) => {
      done(err);
      this.meta = {
        gitInit: answers.gitInit,
        googleAnalyticsCategory: slugify(this.appname) + "-v1.0",
        isFullbleed: this.projectConfig.isFullbleed,
        name: this.appname,
        s3bucket: "graphics.axios.com",
        s3folder: slugify(this.appname),
        slug: slugify(this.appname),
        appleFallback: `fallbacks/${slugify(this.appname)}-apple.png`,
        newsletterFallback: `fallbacks/${slugify(this.appname)}-fallback.png`,
      };
    });
  }

  configuring() {
    // Copy all the files.
    this.fs.copy(this.templatePath("**/*"), this.destinationRoot(), {
      globOptions: { dot: true, ignore: ["node_modules"] },
    });

    // Copy over templated files
    // webpack
    this.fs.copyTpl(this.templatePath("*.config.js"), this.destinationRoot(), {
      meta: this.meta,
    });

    // project.config.json
    this.fs.copyTpl(
      this.templatePath("*.config.json"),
      this.destinationRoot(),
      {
        meta: this.meta,
      }
    );

    // readme
    this.fs.copyTpl(this.templatePath("*.md"), this.destinationRoot(), {
      meta: this.meta,
    });
  }

  install() {
    this.yarnInstall();
  }

  end() {
    let endMessage = `
  Nice! You're ready to start making an Axios interactive!
  Start by writing code into files in the src/ subdirectory

  1. Preview it locally on browsers and devices to make sure it looks ok:

    > gulp serve

  2. Troubleshooting? Check the logs when you compile everything:

    > gulp build

  3. Publish!

    > gulp publish
    `;
    if (this.meta.gitInit) {
      this.spawnCommand("git", ["init"]);
    }
    this.log(endMessage);
  }
};
