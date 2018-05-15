
/* eslint-env node */

const path = require("path");
const webpack = require("webpack");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const InlineManifestWebpackPlugin = require("inline-manifest-webpack-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
// const moduleImporter = require("sass-module-importer");


/**
 * This exported function and the following line catches all of the ways to run webpack in "production" mode from the CLI 
 * - $> webpack -p
 * - $> webpack --env.production
 * - $> NODE_ENV=production webpack
 */
module.exports = (env = {}, { p } = { p: false }) => {
  const isProd = p || env.production || process.env.NODE_ENV === "production";

  /**
   * Common configuration for both production and development styling
   * - css-loader transforms vanilla CSS into JS modules for bundling by webpack
   * - postcss-loader runs CSS -> CSS transformations (see postcss.config.js for details)
   * - sass-loader converts Sass to CSS. sass-module-importer makes finding sass partials easier.
   */
  // const styleLoaders = [
  //   {
  //     loader: "css-loader",
  //     options: {
  //       sourceMap: !isProd,
  //       minimize: isProd
  //     },
  //   },
  //   {
  //     loader: "postcss-loader",
  //     options: {
  //       sourceMap: !isProd
  //     }
  //   },
  //   {
  //     loader: "sass-loader",
  //     options: {
  //       sourceMap: !isProd,
  //       // importer: moduleImporter()
  //     }
  //   }
  // ];

  // For production, wrap the three loaders above with ExtractTextPlugin, which produces a .css file
  // const prodCssConfig = ExtractTextPlugin.extract({
  //   fallback: "style-loader",
  //   use: styleLoaders,
  //   publicPath: "/",
  // });

  // In development, the output of the three loaders above is inlined into the JS bundle
  // const devCssConfig = [
  //   { loader: "style-loader" },
  //   ...styleLoaders
  // ];

  const wpconfig = {
    mode: isProd ? "production" : "development",
    entry: {
      bundle: "./src/js/app.js"
    },

    output: {
      // Computing [chunkhash] is slow, so only do it for production (needed for caching)
      filename: isProd ? "[name].[chunkhash].js" : "[name].js",
      // There are a number of bugs with loaders and HMR around publicPath, so hardcode it for development
      publicPath: isProd ? "/" : "http://localhost:3001/",
    },

    // Emit sourcemaps for easier debugging of Babelified code (Sass sourcemaps are controlled through loader options)
    devtool: "source-map",

    module: {
      rules: [
        // Inline small (<64k) woff files as data urls to prevent FOUT.
        {
          test: /\.woff(2)?(\?[a-z0-9=]+)?$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 64000,  // If the file limit is exceeded, will be loaded remotely using file-loader
              },
            },
          ],
        },

        // Asset types to be hashed and output to dist, but not included in the bundle
        {
          test: /\.(png|jpe?g|gif|svg)(\?[a-z0-9=]+)?$/,
          use: "file-loader",
        },

        // Run first-party code through Babel - see .babelrc for more detail on plugins/config
        {
          test: /\.js$/,
          include: path.join(__dirname, "src"),
          use: {
            loader: "babel-loader",
            options: {
              "presets": ["env"]
            }
          }
        },

        // Run Sass and CSS through CSS loaders described above, depending on environment
        // {
        //   test: /\.s?css$/,
        //   loader: isProd ? prodCssConfig : devCssConfig,
        // },
      ],
    },

    resolve: {
      extensions: [".js", ".json", ".scss", ".css"],
    },

    // Plugins used in both production and development environments
    plugins: [
      // Don't emit if Webpack encounters an error while bundling (this can bury issues)
      new webpack.NoEmitOnErrorsPlugin(),

      // Show names of modules instead of IDs. Helpful for seeing what is getting reloaded in each HMR patch.
      new webpack.NamedModulesPlugin(),

      // Make NODE_ENV available to client code, helpful for switching between APIs or toggling analytics
      new webpack.DefinePlugin({
        "PRODUCTION": JSON.stringify(process.env.NODE_ENV === "production"),
      }),

      // Generate an index.html for the app. Doing this with Webpack makes the vendor/manifest chunk much easier (below)
      // new HtmlWebpackPlugin({
      //   template: "./src/index.ejs"
      // }),

      // If the location on disk of an imported module is in node_modules, move it to a common chunk
      // This chunk (vendor.hash.js) can be cached until you update or change libraries, independent of first-party JS
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: "vendor",
      //   minChunks: ({ resource }) => /node_modules/.test(resource),
      // }),

      // The manifest chunk lists the other chunks needed for this route
      // The manifest is necessary to get a static hash on the vendor chunk for builds that don't change vendor libs
      // new webpack.optimize.CommonsChunkPlugin("manifest"),

      // Inline the manifest to save an HTTP request (it should only be a few kB)
      // new InlineManifestWebpackPlugin(),

      // Load each chunk with <script defer>, which improves percieved perf in modern browsers.
      // Using defer guarantees that parsing the JS won't block the page from loading, but will be parsed in order
      // new ScriptExtHtmlWebpackPlugin({
      //   defaultAttribute: "defer",
      // }),
    ],

    // devServer: {
    //   hot: true,  // Enable hot module reload
    //   publicPath: "/",
    //   overlay: true,  // When webpack encounters an error while building, display it in the browser in a redbox
    //   port: 3005,
    //   historyApiFallback: true
    // },

    // Webpack is a little aggressive with its chiding about large chunks by default, these settings tone that down
    performance: {
      maxAssetSize: 350000,
      maxEntrypointSize: 500000,
      hints: isProd ? "warning" : false,
    },
  };

  if (!isProd) {
    // Add plugins used only in development
    // wpconfig.plugins = [
    //   new webpack.HotModuleReplacementPlugin(),
    //   ...wpconfig.plugins
    // ];
  } else {
    // Plugins used only in production
    wpconfig.plugins = [
      // Create a separate CSS file - prevents FOUC in production
      // new ExtractTextPlugin({
      //   filename: "[name].[contenthash].css",
      // }),

      // Same effect as turning on webpack CLI's --optimize-minimize flag
      new webpack.optimize.minimize({ sourceMap: true }),
      ...wpconfig.plugins,
    ];
  }

  return wpconfig;
};
