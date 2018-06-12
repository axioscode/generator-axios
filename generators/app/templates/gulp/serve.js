'use strict';

const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server')
const webpackConfig = require('../webpack.config');

module.exports = () => {
  // modify some webpack config options
  var config = Object.create(webpackConfig());
  config.devtool = "eval";
  config.mode = "development";
  // Start a webpack-dev-server
  console.log("PATH: " + config.output.path);
  new webpackDevServer(webpack(config), {
    publicPath: "/" + config.output.path,
    stats: {
      colors: true
    }
  }).listen(3000, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    // gutil.log("[webpack-dev-server]", "http://localhost:3000/webpack-dev-server/build/index.html");
  });
};
