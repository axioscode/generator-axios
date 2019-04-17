module.exports = api => {
  api.cache.invalidate(() => process.env.NODE_ENV === "production");
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            browsers: ["last 2 versions", "Safari 9", "IE 11"],
          },
          useBuiltIns: "usage",
          corejs: 3,
        },
      ],
    ],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-transform-async-to-generator",
      "@babel/plugin-transform-runtime",
    ],
  };
};
