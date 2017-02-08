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

const bs = require('./browsersync')
const config = require('./config');

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

var props = {
  transform: [["babelify", { "presets": ["es2015"] }]],
  entries: [config.paths.src.js + "/app.js"]
};
if (!IS_PRODUCTION) {
  var props = Object.assign(props, {
    debug: true,
    fullPaths: true
  });
}
var b = browserify(props);

var rebundle = function(pkg) {
  return pkg.bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(config.paths.tmp.js +  "/"))
    .pipe(gulpIf(IS_PRODUCTION, buffer()))
    .pipe(gulpIf(IS_PRODUCTION, sourcemaps.init({loadMaps: true})))
    .pipe(gulpIf(IS_PRODUCTION, uglify().on("error", gutil.log)))
    .pipe(gulpIf(IS_PRODUCTION, sourcemaps.write('./')))
    .pipe(gulpIf(IS_PRODUCTION, gulp.dest(config.paths.dist.js + "/")))
    .pipe(bs.stream({match: '**/*.js'}))
    .pipe(size({title: 'scripts', showFiles: true}))
}


module.exports = {
  build: function() {
    b.on('error', function(error) {
      console.log(error.stack, error.message);
      this.emit('end');
      process.exit(0);
    })
    return (rebundle(b));
  },
  watch: function() {
    var w = watchify(b);
    w.on('error', function(error) {
      console.log(error.stack, error.message);
    });
    w.on('update', function() {
      rebundle(w);
      gutil.log('Rebundle...');
    });
    return rebundle(w);
  }
}
