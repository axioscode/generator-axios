module.exports = {
  "extends": "eslint:recommended",
  parserOptions: {
    sourceType: "script",
    "ecmaVersion": 6
  },
  rules: {
    "no-console": "off",
    "indent": [
      "warn",
      2,
      { SwitchCase: 1 }
    ],
    "semi": [
      "warn",
      "always",
      {
        "omitLastInOneLineBlock": true
      }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "no-unused-vars": ["error"],
  },
  env: {
    "browser": true,
    "node": true,
    "es6": true
  }
}
