module.exports = {
  parserOptions: {
    sourceType: "script",
    "ecmaVersion": 6
  },
  rules: {
    "indent": [
      "warn",
      2,
      { SwitchCase: 1 }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "no-unused-vars": ["error"],
  },
  env: {
    node: true
  }
}
