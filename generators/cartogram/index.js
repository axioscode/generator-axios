const Generator = require("yeoman-generator");
const AxiosGenerator = require("../app/index.js");
const packages = require("./templates/package.json");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  // 1. Start the axios generator in parallel
  initializing() {
    console.log("initializing - cartogram");
    this.composeWith({
      Generator: AxiosGenerator,
      path: require.resolve("../app")
    });
  }

  // 2. After axios generator has copied its files, replace the src folder
  default() {
    console.log("default - cartogram");
    this.fs.delete(this.destinationPath("src/**"));
    this.fs.copy(this.templatePath("src/**"), this.destinationPath("src"), {
      globOptions: {}
    });
  }

  // 3. Extend the dependencies to include any new ones from package.json
  // (This happens right before the axios generator does `yarn install`)
  install() {
    console.log("install - cartogram");
    const newDeps = {
      dependencies: packages.dependencies,
      devDependencies: packages.devDependencies
    };
    this.fs.extendJSON(this.destinationPath("package.json"), newDeps);
  }
};
