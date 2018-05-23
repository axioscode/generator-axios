'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const bs = require('./browsersync');
const config = require('./config');
const webpackConfig = require('../webpack.config');

const bundle = (watch = false) => webpackStream(Object.assign(
  { watch },
  webpackConfig()
), webpack)
  .pipe(gulpIf(process.env.NODE_ENV === "production", gulp.dest(`${config.paths.dist.js}/`)))
  .pipe(gulp.dest(`${config.paths.tmp.js}/`));

module.exports = {
  build: () => bundle(),
  // The watch task should run asynchronously; this is achieved in Gulp by returning a promise
  watch: () => Promise.resolve(
    bundle(true).pipe(bs.stream({match: '**/*.js'}))
  )
};
