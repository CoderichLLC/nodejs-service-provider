const { getEslintConfig } = require('@coderich/dev');

module.exports = getEslintConfig({
  rules: {
    'no-new': 'off',
  },
});
