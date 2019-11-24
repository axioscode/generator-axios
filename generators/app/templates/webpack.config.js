/* eslint-env node */

const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const vizConfig = require("./project.config");

module.exports = (env = {}, { p } = { p: false }) => {
  const isProd = p || env.production || process.env.NODE_ENV === "production";
  let wpconfig = {
    mode: isProd ? "production" : "development",

    entry: {
      app: "./src/js/app.js",
    },

    devtool: "source-map",

    stats: {
      colors: true,
    },

    module: {
      rules: [
        // data files
        // excluding json which are natively handled by webpack
        // todo: inline sm
        {
          test: /\.(.+sv|.*aml)$/,
          include: path.join(__dirname, "src/data"),
          loader: "file-loader",
          options: {
            name: "[path][name].[hash].[ext]",
            context: path.join(__dirname, "src"),
          },
        },
        // fonts
        {
          test: /\.(woff2?|ttf|otf|eot|svg)$/,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
            context: path.join(__dirname, "src"),
          },
        },
        // images
        // optimizations are unique to each image optimizer
        {
          test: /\.(gif|png|jpe?g|svg|webp)$/i,
          include: [
            path.join(__dirname, "src/fallbacks"),
            path.join(__dirname, "src/img"),
          ],
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[path][name].[ext]",
                context: path.join(__dirname, "src"),
              },
            },
            {
              loader: "image-webpack-loader",
              options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true, // webpack@2.x and newer
                mozjpeg: {
                  quality: 70,
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: true,
                },
                pngquant: {
                  quality: "70-90",
                  speed: 4,
                },
                gifsicle: {
                  optimizationLevel: 2,
                },
                webp: {
                  quality: 70,
                },
              },
            },
          ],
        },

        // styles
        // specifically sass files, .scss and .sass
        {
          test: /\.s[c|a]ss$/,
          use: [
            {
              // prod: extract sass to separate css file
              // dev: inject css via js as a blob in index.html
              loader: isProd ? MiniCssExtractPlugin.loader : "style-loader",
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                localIdentName: "[name]__[local]--[hash:base64:5]",
                importLoaders: 3,
              },
            },
            {
              // auto prefixes for older browsers
              loader: "postcss-loader",
              options: {
                sourceMap: true,
                config: {
                  ctx: {
                    autoprefixer: {
                      browsers: ["last 2 versions", "Safari 9", "IE 11"],
                      grid: true,
                    },
                  },
                },
              },
            },
            {
              // required by sass-loader to resolve urls in sass files
              loader: "resolve-url-loader",
              options: { sourceMap: true },
            },
            {
              loader: "sass-loader",
              options: { sourceMap: true },
            },
          ],
        },

        // handle any require statements in index.ejs for img assets
        {
          test: /\.ejs$/,
          use: "ejs-loader",
        },

        {
          test: /\.js$/,
          exclude: /node_modules\/(?!d3-*)/,
          use: "babel-loader",
        },
      ],
    },

    output: {
      path: path.join(__dirname, "dist"),
      filename: isProd ? "js/[name].[hash].min.js" : "[name].js",
    },

    resolve: {
      extensions: [".js", ".json", ".scss", ".css"],
      modules: [path.join(__dirname, "src"), "node_modules"],
    },

    plugins: [
      // Don't create a file if Webpack encounters an error while bundling
      new webpack.NoEmitOnErrorsPlugin(),

      new CleanWebpackPlugin(),

      // Make project name available to client code as process.env.NAME
      // Useful for sending data back to Google Analytics
      // Make NODE_ENV available to client code as process.env.ENV, helpful for switching between APIs or toggling analytics
      new webpack.DefinePlugin({
        "process.env.NAME": vizConfig.project.name,
        "process.env.SLUG": vizConfig.project.slug,
        "process.env.ENV": JSON.stringify(
          process.env.NODE_ENV || "development"
        ),
      }),

      // Generate HTML from the ejs file, minifying for production
      // Useful for passing data into the EJS template
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src/index.ejs"),
        hash: isProd,
        minify: isProd
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
        title: vizConfig.project.name,
        ...vizConfig,
      }),

      // Ignore all Moment locales. Via: https://webpack.js.org/plugins/ignore-plugin/
      // (literally the canonical use case for this plugin I hate Moment so much)
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // More fun hacks necessitated by our friends at moment dot js
      new webpack.NormalModuleReplacementPlugin(
        /moment-timezone\/data\/packed\/latest\.json/,
        require.resolve(path.join(__dirname, "./utils/timezones.json"))
      ),

      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: "defer",
      }),
    ],

    devServer: {
      contentBase: path.join(__dirname, "dist"),
      headers: { "Access-Control-Allow-Origin": "*" },
      compress: true,
      hot: true, // Enable hot module reload
      overlay: true, // When webpack encounters an error while building, display it in the browser in a redbox
      open: true,
      stats: {
        colors: true,
      },
    },

    performance: {
      maxAssetSize: 350000,
      maxEntrypointSize: 500000,
      hints: isProd ? "warning" : false,
    },

    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            safari10: true,
          },
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
            },
          },
        }),
      ],
    },
  };

  if (!isProd) {
    wpconfig.plugins.push(
      // Show names of modules instead of IDs. Helpful for seeing what is getting reloaded in each HMR patch.
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    );
  } else {
    wpconfig.plugins.push(
      new MiniCssExtractPlugin({
        filename: "css/styles.[contenthash].min.css",
      })
    );
  }

  return wpconfig;
};
