module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 251],
    'scope-case': [2, 'always', 'kebab-case'],
    'body-max-line-length': [2, 'always', 509], // caracter in body (per line)
    'body-max-length': [2, 'always', 5015], // total caracter in body
    'footer-max-line-length': [2, 'always', 555], // caracter in footer (per line)
  },
};
