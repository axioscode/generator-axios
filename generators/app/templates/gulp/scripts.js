'use strict';

const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const bs = require('./browsersync')
const config = require('./config');
const webpackConfig = require('../webpack.config');

const outputPath = process.env.NODE_ENV === "production" ? config.paths.dist.js : config.paths.tmp.js;

const bundle = (watch = false) => webpackStream(Object.assign(
    { watch },
    webpackConfig()
  ), webpack)
  .pipe(gulp.dest(`${outputPath}/`));

module.exports = {
  build: () => bundle(),
  // The watch task should run asynchronously; this is achieved in Gulp by returning a promise
  watch: () => Promise.resolve(
    bundle(true).pipe(bs.stream({match: '**/*.js'}))
  )
};
