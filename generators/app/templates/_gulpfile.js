'use strict';

const gulp = require("gulp");
const env = require("gulp-env");
const runSequence = require('run-sequence');
const gulpConfig = require('./gulp/config');

gulp.task('styles', require('./gulp/styles'));
gulp.task('templates', require('./gulp/templates'));
gulp.task('scripts', require('./gulp/scripts').build);
gulp.task('scripts:watch', require('./gulp/scripts').watch);
gulp.task('images', require('./gulp/images'))

gulp.task('set-prd-env', function () {
  env({
    vars: { NODE_ENV: "production"}
  })
});

gulp.task('set-dev-env', function () {
  env({
    vars: { NODE_ENV: "development"}
  })
});

gulp.task('clean', require('./gulp/clean'))

gulp.task('build', ['clean'], (done) => {
  runSequence(['images'], ['styles', 'templates', 'scripts'], done)
})

gulp.task('build:prd', ['set-prd-env'], function (done) {
  runSequence(['build'], done)
})

gulp.task('watch', ['images', 'styles', 'templates', 'scripts:watch'], function (done) {
	gulp.watch(gulpConfig.paths.src.sass + "/**", ['styles']);
	gulp.watch(gulpConfig.paths.src.templates + "/**", ['templates']);
	done();
});

gulp.task('serve', ['watch'], require('./gulp/serve'));
gulp.task('publish', ['build:prd'], require('./gulp/publish'));
gulp.task('default', ['build'])
