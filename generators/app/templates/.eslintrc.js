module.exports = {
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 6
  },
  "rules": {
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
  "globals": {
    "module": true,
    "process": true
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  }
}
