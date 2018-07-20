"use strict";
const gulp = require("gulp");
const log = require("fancy-log");
const colors = require("ansi-colors");
const shell = require("gulp-shell");

const projectConfig = require('./project.config.json');

// Setup tasks
gulp.task("setup:analyzer", shell.task(
  "npm install --global webpack webpack-cli webpack-bundle-analyzer"
));
gulp.task("setup:aws", shell.task([
  "pip install awscli",
  "aws init",
]));
gulp.task("setup:lint", shell.task(
  "npm install --global eslint"
));
gulp.task("setup:imgmin", shell.task(
  "brew install libpng"
));
gulp.task("setup", gulp.series(
  "setup:analyzer",
  "setup:aws",
  "setup:imgmin",
  "setup:lint"
));

// Google Drive tasks
gulp.task('gdrive:add', require('./gulp/gdrive').addFile);
gulp.task('gdrive:fetch', require('./gulp/gdrive').fetch);

// Development tasks
gulp.task("watch", shell.task(
  "./node-modules/.bin/webpack --watch"
));
gulp.task("serve", shell.task(
  "./node_modules/.bin/webpack-dev-server --hot --mode development"
));
gulp.task("lint", shell.task(
  "eslint src/js && stylelint src/sass"
));

// Publishing tasks
gulp.task("build", shell.task(
  "./node_modules/.bin/webpack -p"
));
gulp.task("deploy", shell.task(
  `aws s3 cp dist s3://${projectConfig.s3.bucket}/${projectConfig.s3.folder} --recursive --acl public-read`
));
gulp.task("publish:log", (done) => {
  log("");
  log("🎉 ", colors.green.bold("Your project can be accessed and embedded using the following url:"));
  log(`\thttps://${projectConfig.s3.bucket}/${projectConfig.s3.folder}/index.html`);
  log("");
  log("👉 ", colors.blue.bold("Login to the Axios CMS:"));
  log("\thttps://eden.axios.com/dashboard");
  log("");
  done();
});
gulp.task("publish", gulp.series(
  "build",
  "deploy",
  "publish:log"
));

gulp.task("clean", shell.task(
  "rm -rf dist"
));

gulp.task("default", gulp.series("serve"));

