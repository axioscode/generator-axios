const path = require("path");

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
  };

  return wpconfig;
};
