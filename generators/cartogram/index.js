const Generator = require("yeoman-generator");
const AxiosGenerator = require("../app/index.js");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    console.log("initializing");
    this.composeWith({
      Generator: AxiosGenerator,
      path: require.resolve("../app")
    });
  }

  configuring() {
    console.log("configuring");
    this.fs.copy(this.templatePath("src/**"), this.destinationRoot(), {
      globOptions: {}
    });
  }

  install() {
    console.log("install");
    this.yarnInstall();
  }

  end() {
    console.log("end");
    this.log("This is the true end");
  }
};
