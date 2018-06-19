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
      index: "./src/js/app.js",
    },

    devtool: isProd ? "source-map" : "inline-source-map",

    module: {
      rules: [

        {
          test: /\.js$/,
          include: path.join(__dirname, "src/js"),
          use: [{ loader: "babel-loader" }],
        },

        {
          test: /\.scss$/,
          include: path.join(__dirname, "src/sass"),
          use: [{
            loader: isProd? MiniCssExtractPlugin.loader : "style-loader",
          },
          {
            loader: "css-loader", options: {
              sourceMap: !isProd,
              minimize: isProd,
              importLoaders: 1,
            }
          },
          {
            loader: "sass-loader", options: {
              sourceMap: !isProd,
              includePaths: ['node_modules/axios-feta/src']
            }
          }],
        }
      ]
    },

    output: {
      path: path.join(__dirname, "dist"),
      filename: isProd ? "[name].[chunkhash].js" : "[name].js",
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
        path: path.join(__dirname, "dist"),
        filename: isProd? "[name].[contenthash].css" : "[name].css",
      }),

      new HtmlWebpackPlugin({
        appleFallback: vizConfig.appleFallback,
        hash: isProd,
        isFullbleed: vizConfig.isFullbleed,
        minify: isProd,
        newsletterFallback: vizConfig.newsletterFallback,
        slug: vizConfig.slug,
        template: path.join(__dirname, "src/index.ejs"),
        title: "<%= meta.name %>",
      }),

      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: "defer",
      }),

      new WebpackMd5Hash(),
    ],

    devServer: {
      contentBase: path.join(__dirname, "src"),
      headers: { "Access-Control-Allow-Origin": "*" },
      hot: true,  // Enable hot module reload
      overlay: true,  // When webpack encounters an error while building, display it in the browser in a redbox
      port: 3000,
      stats: { colors: true },
      watchContentBase: true,
    },

    performance: {
      maxAssetSize: 350000,
      maxEntrypointSize: 500000,
      hints: isProd ? "warning" : false,
    },
  };

  if (!isProd) {
    wpconfig.plugins.push(
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    );
  }

  return wpconfig;
};
