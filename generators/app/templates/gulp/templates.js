'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const handlebars = require('gulp-hb');
const gulpIf = require('gulp-if');
const size = require('gulp-size');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const debug = require('gulp-debug');
const path = require('path');
const url = require('url');

const bs = require('./browsersync')
const config = require('./config');
const projectConfig = require('./../project.config');

const IS_PRODUCTION = gutil.env.env === 'production'

var staticUrl = function(p) {
  if (IS_PRODUCTION) p = path.join(projectConfig.s3.folder, p)
  return url.resolve('/', p)
}

var imageUrl = function(p) {
  p = 'img/' + p;
  if (IS_PRODUCTION) p = path.join(projectConfig.s3.folder, p)
  return url.resolve('/', p)
}

var toFixed2 = function(p) {
  return p.toFixed(2);
}



module.exports = () => {
  var handlebarsStream = handlebars({bustCahce: true})
      .partials(config.paths.src.templates + '/partials/**/*.{hbs,js}')
      .partials(config.paths.src.templates + '/layouts/**/*.{hbs,js}')
      .helpers(config.paths.src.templates + '/helpers/**/*.{js}')
      .helpers(require('handlebars-layouts'))
      .helpers({
        'static': staticUrl,
        'img': imageUrl,
        'toFixed2': toFixed2
      })
      .data(config.dirs.data + '/**/*.{js,json}');

  return gulp.src(config.paths.src.templates + '/*.hbs')
    .pipe(handlebarsStream)
    .pipe(rename((file) => {
      if (file.basename !== 'index') {
        file.dirname = path.join(file.dirname, file.basename);
        file.basename = 'index';
      }
      file.extname = '.html';
    }))
    .pipe(gulp.dest(config.dirs.tmp))
    .pipe(gulpIf(IS_PRODUCTION, htmlmin({collapseWhitespace: true})))
    .pipe(gulpIf(IS_PRODUCTION, gulp.dest(config.dirs.dist)))
    .pipe(bs.stream({once: true}))
    .pipe(size({title: 'templates', showFiles: true}))
}
