'use strict';

const gulp = require('gulp');
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
    .pipe(gulp.dest, config.paths.dist.fallbacks);

  return gulp.src(config.paths.src.fallbacks + "/**")
    .pipe(gulp.dest(config.paths.tmp.fallbacks))
    .pipe(gulpIf(process.env.NODE_ENV === "production", prdTasks()))
    .pipe(size({title: 'fallbacks'}))
    .pipe(bs.stream());
};
