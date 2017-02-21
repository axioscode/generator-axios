'use strict';

const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const envify = require('envify');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const gutil = require('gulp-util');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const lazypipe = require('lazypipe');

const bs = require('./browsersync')
const config = require('./config');

var getBundle = function() {
  var props = {
    transform: [["babelify", { "presets": ["es2015"] }]],
    entries: [config.paths.src.js + "/app.js"]
  };

  // If we're not in a production environment, build sourcemaps and preserve module IDs (I don't
  // konw what that second thing means).
  if (process.env.NODE_ENV !== "production") {
    var props = Object.assign(props, {
      debug: true,
      fullPaths: true
    });
  }

  return browserify(props);
};

var rebundle = function(pkg) {
  // Bundle and lazy-evaluate the production tasks.
  var prdTasks = lazypipe()
    .pipe(buffer)
    .pipe(sourcemaps.init, {loadMaps: true})
    .pipe(uglify, {compress: {drop_console: true}})
    .pipe(sourcemaps.write, "./")
    .pipe(gulp.dest, config.paths.dist.js + "/")

  return pkg.bundle()
    .on('error', function(error) {
      console.log(error.stack, error.message);
    })
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(config.paths.tmp.js +  "/"))
    .pipe(gulpIf(process.env.NODE_ENV == "production", prdTasks()))
    .pipe(bs.stream({match: '**/*.js'}))
    .pipe(size({title: 'scripts', showFiles: true}))
}


module.exports = {
  build: function() {
    return (rebundle(getBundle()));
  },
  watch: function() {
    var w = watchify(getBundle());
    w.on('update', function() {
      rebundle(w);
      gutil.log('Rebundle...');
    });
    return rebundle(w);
  }
}

