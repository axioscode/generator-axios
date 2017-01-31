'use strict';

const gulp = require('gulp')
const gulpIf = require('gulp-if')
const cache = require('gulp-cache')
const imagemin = require('gulp-imagemin')
const size = require('gulp-size')

const bs = require('./browsersync')
const config = require('./config');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
console.log(process.env.NODE_ENV);

module.exports = () => {
  return gulp.src(config.paths.src.img + "/**")
    .pipe(gulp.dest(config.paths.tmp.img))
    .pipe(gulpIf(IS_PRODUCTION, cache(imagemin())))
    .pipe(gulpIf(IS_PRODUCTION, gulp.dest(config.paths.dist.img)))
    .pipe(size({title: 'images'}));
}
