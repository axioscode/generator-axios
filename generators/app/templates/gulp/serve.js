'use strict';

const path = require("path");
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
  const compiler = webpack(config);
  new webpackDevServer(compiler, {
    contentBase: path.join(__dirname, "../.tmp/"),
    headers: { "Access-Control-Allow-Origin": "*" },
    hot: true,
    open: true,
    overlay: true,
    port: 3000,
    publicPath: path.join(__dirname, "../.tmp/"),
    stats: { colors: true },
  }).listen(3000, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]", `http://localhost:3000`);
  });
};
