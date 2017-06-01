'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpIf = require('gulp-if');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const size = require('gulp-size');
const lazypipe = require('lazypipe');

const bs = require('./browsersync');
const config = require('./config');

module.exports = () => {
  // Production tasks.
  var prdTasks = lazypipe()
    .pipe(cache, imagemin())
    .pipe(gulp.dest, config.paths.dist.img);

  return gulp.src(config.paths.src.img + "/**")
    .pipe(gulp.dest(config.paths.tmp.img))
    .pipe(gulpIf(process.env.NODE_ENV === "production", prdTasks()))
    .pipe(size({title: 'images'}))
    .pipe(bs.stream());
}
