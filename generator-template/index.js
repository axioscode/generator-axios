const Generator = require("yeoman-generator");
const AxiosGenerator = require("../app/index.js");
const packages = require("./templates/package.json");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  // 1. Start the axios generator in parallel
  initializing() {
    this.composeWith({
      Generator: AxiosGenerator,
      path: require.resolve("../app")
    });
  }

  // 2. After axios generator has copied its files, replace the src folder
  default() {
    this.fs.delete(this.destinationPath("src/**"));
    this.fs.copy(this.templatePath("src/**"), this.destinationPath("src"), {
      globOptions: {}
    });

    // *** Use this to copy over another directory from templates to the destination ***
    // mkdirp.sync(this.destinationPath("admin"));
    // this.fs.copy(this.templatePath("admin/**"), this.destinationPath("admin"));
  }

  // 3. Extend the dependencies to include any new ones from package.json
  // (This happens right before the axios generator does `yarn install`)
  install() {
    const newDeps = {
      dependencies: packages.dependencies,
      devDependencies: packages.devDependencies
    };
    this.fs.extendJSON(this.destinationPath("package.json"), newDeps);
  }
};
