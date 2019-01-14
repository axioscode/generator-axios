"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-axios unit tests", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({ gitInit: false });
  });

  it("copies config files", () => {
    assert.file([
      ".eslintrc.js",
      "babel.config.js",
      "gulpfile.js",
      "project.config.json",
      "package.json",
    ]);
  });
});
