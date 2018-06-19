"use strict";
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const vizConfig = require("./project.config");

module.exports = (env = {}, { p } = { p: false }) => {
  const isProd = p || env.production || process.env.NODE_ENV === "production";
  let wpconfig = {
    mode: isProd ? "production" : "development",
    entry: {
      bundle: path.join(__dirname, "src/js/app.js"),
    },

    devtool: !isProd ? "inline-source-map" : "source-map",

    module: {
      rules: [{
        test: /\.js$/,
        include: path.join(__dirname, "src/js"),
        use: [{
          loader: "babel-loader",
          presets: ["env",]
        }],
      }, {
        test: /\.scss$/,
        include: path.join(__dirname, "src/sass"),
        use: [{
          loader: isProd ? "style-loader" : MiniCssExtractPlugin.loader,
        }, {
          loader: "css-loader", options: {
            sourceMap: !isProd,
            minimize: isProd,
          }
        }, {
          loader: "sass-loader", options: {
            sourceMap: !isProd
          }
        }],
      }],
    },

    output: {
      path: path.join(__dirname, "dist"),
      filename: isProd ? "bundle.[chunkhash].js" : "bundle.js",
    },

    resolve: {
      extensions: [".js", ".json", ".scss", ".css"],
      modules: [path.join(__dirname, "src"), "node_modules"],
    },

    plugins: [
      new CleanWebpackPlugin('dist'),

      new webpack.DefinePlugin({
        "process.env.NAME": JSON.stringify(vizConfig.name || ""),
      }),

      new MiniCssExtractPlugin({
        filename: "dist/[name].[contenthash].css",
      }),

      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src/index.ejs"),
        filename: path.join(__dirname, "dist/index.html"),
        title: "<%= meta.name %>",
        minify: isProd,
        hash: isProd,
        isFullbleed: vizConfig.isFullbleed,
        slug: vizConfig.slug,
        appleFallback: vizConfig.appleFallback,
        newsletterFallback: vizConfig.newsletterFallback,
      }),

      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: "defer",
      }),

      new WebpackMd5Hash(),
    ],

    devServer: {
      headers: { "Access-Control-Allow-Origin": "*" },
      hot: true,  // Enable hot module reload
      publicPath: "src",
      overlay: true,  // When webpack encounters an error while building, display it in the browser in a redbox
      port: 3000,
    },
  };

  if (!isProd) {
    wpconfig.plugins.push(
      new webpack.HotModuleReplacementPlugin()
    );
  }

  return wpconfig;
};
