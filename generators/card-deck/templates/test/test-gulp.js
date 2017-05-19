const assert = require('assert');
const fs = require('fs');
const path = require('path');

const runSequence = require('run-sequence');
const config = require("../gulp/config");

require("../gulpfile");

var pathExists = (file) => {
  assert.ok(fs.existsSync(file), `${file} was not generated!`)
};

// These are some rudimentary tests to make sure that the production environment is generating all
// the files that it should out of the box. These tests are more of a canary than anything.
describe("Production", () => {
  before((done) => {
    runSequence('build', () => {
      done();
    })
  });

  it('should create the production directory.', () => { pathExists(config.dirs.dist) })

  describe("Templates", () => {
    it('should generate index.html', () => { pathExists(path.join(config.dirs.dist, 'index.html')) })
  })

  describe("Scripts", () => {
    it('should generate a javascript bundle', () => { pathExists(path.join(config.paths.dist.js, 'bundle.js')) })
    it('should generate a javascript bundle sourcemap', () => { pathExists(path.join(config.paths.dist.js, 'bundle.js.map')) })
  })

  describe("Styles", () => {
    it('should generate a default CSS file', () => { pathExists(path.join(config.paths.dist.css, 'main.css')) })
  })

  describe("Images", () => {
    it('should generate the img/ directory', () => { pathExists(config.paths.dist.img) })
  })
});

