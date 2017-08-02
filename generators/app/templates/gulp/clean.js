'use strict'

const del = require('del');
const config = require('./config');

module.exports = (done) => {
  return del([
    config.dirs.dist,
    config.dirs.tmp,
    // "!" + config.dirs.dist + '/.git'
  ], {dot: true}, done)
}
