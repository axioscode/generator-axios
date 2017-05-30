'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpIf = require('gulp-if');
const size = require('gulp-size');

const bs = require('./browsersync');
const config = require('./config');

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = () => {
  return gulp.src(config.paths.src.data + "/**")
    .pipe(gulp.dest(config.paths.tmp.data))
    .pipe(gulpIf(IS_PRODUCTION, gulp.dest(config.paths.dist.data)))
    .pipe(size({title: 'data'}))
    .pipe(bs.stream());
}
