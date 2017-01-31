'use strict';

const gulp = require('gulp');
const size = require('gulp-size');

const bs = require('./browsersync')
const config = require('./config');

module.exports = () => {
  bs.init({
  	server: { baseDir: config.dirs.tmp },
		open: false
	});
}
