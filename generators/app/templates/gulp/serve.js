'use strict';

const gulp = require('gulp');

const bs = require('./browsersync')
const config = require('./config');

module.exports = () => {
  bs.init({
    server: {
      baseDir: config.dirs.tmp,
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    },
    open: false
  });
}
