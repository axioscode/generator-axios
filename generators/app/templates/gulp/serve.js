'use strict';

const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config');

module.exports = () => {
  // modify some webpack config options
  var config = Object.assign({
    mode: "development"
  }, webpackConfig());
  // Start a webpack-dev-server
  new webpackDevServer(webpack(config)).listen(config.devServer.port, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]", `http://localhost:${config.devServer.port}`);
  });
};
