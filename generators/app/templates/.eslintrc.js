module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
    ecmaVersion: 8,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
      },
    ],
    "one-var": [
      "error",
      {
        initialized: "never",
      },
    ],
    "no-var": "error",
  },
  globals: {
    module: true,
    process: true,
    __BROWSER__: true,
    global: true,
  },
};
