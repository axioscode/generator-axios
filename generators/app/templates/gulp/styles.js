'use strict';

const gulp = require('gulp');
const gutil = require('gulp');
const cleancss = require('gulp-clean-css')
const gulpIf = require('gulp-if');
const sass = require('gulp-sass')
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const lazypipe = require('lazypipe');

const bs = require('./browsersync')
const config = require('./config');


module.exports = () => {
  var prdTasks = lazypipe()
    .pipe(cleancss)
    .pipe(sourcemaps.write, '')
    .pipe(gulp.dest, config.paths.dist.css);

  return gulp.src(config.paths.src.sass + "/*.scss")
    .pipe(sass({
      includePaths: [
        'node_modules',
        'node_modules/axios-feta/src'
      ],
      precision: 10
    }).on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(gulp.dest(config.paths.tmp.css))
    .pipe(gulpIf(process.env.NODE_ENV === "production", prdTasks()))
    .pipe(bs.stream({match: '**/*.css'}))
    .pipe(size({title: 'templates', showFiles: true}))
}

