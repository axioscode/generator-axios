const path = require("path");
const webpack = require("webpack");

module.exports = (env = {}, { p } = { p: false }) => {
  const isProd = p || env.production || process.env.NODE_ENV === "production";
  let wpconfig = {
    mode: isProd ? "production" : "development",
    entry: {
      bundle: "./src/js/app.js",
    },

    devtool: isProd ? "source-map" : false,

    module: {
      rules: [{
        test: /\.js$/,
        include: path.join(__dirname, "src"),
        use: [{ loader: "babel-loader" }],
      }],
    },

    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.js",
    },

    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],

    performance: {
      maxAssetSize: 350000,
      maxEntrypointSize: 500000,
      hints: isProd ? "warning" : false,
    },
  };

  return wpconfig;
};
