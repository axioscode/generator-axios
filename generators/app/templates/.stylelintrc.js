module.exports = {
  extends: [
    "stylelint-config-standard",
  ],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [
          "if",
          "else",
          "for",
          "each",
          "extend",
          "define-extend",
          "mixin",
          "define-mixin"
        ]
      }
    ]
  }
}
