"use strict";
const gulp = require("gulp");
const shell = require("gulp-shell");

gulp.task("watch", shell.task(
  "./node-modules/.bin/webpack --watch"
));

gulp.task("serve", shell.task(
  "./node_modules/.bin/webpack-dev-server --open --mode development"
));

gulp.task("setup:aws", shell.task([
  "pip install awscli",
  "aws init",
]));

gulp.task("setup:lint", shell.task(
  "npm install --global eslint"
));

gulp.task("setup", [
  "setup:lint",
  "setup:aws",
]);

gulp.task("lint", shell.task(
  "eslint src/js"
));

gulp.task("build", shell.task(
  "./node_modules/.bin/webpack -p"
));

gulp.task("deploy", shell.task(
  "aws s3 cp dist s3://<%= meta.s3bucket %>/<%= meta.s3folder %> --recursive --acl public-read"
));

gulp.task("publish", ["build", "deploy"]);

gulp.task("clean", shell.task(
  "rm -rf dist"
));

gulp.task('default', ['serve']);

