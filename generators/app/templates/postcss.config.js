module.exports = ({ file, options, env }) => ({
  plugins: {
    "postcss-import": { root: file.dirname },
    autoprefixer: true,
    cssnano: env === "production" ? options.cssnano : false,
  },
});
