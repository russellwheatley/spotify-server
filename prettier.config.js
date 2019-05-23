module.exports = {
  trailingComma: 'es5',
  singleQuote: true,
  arrowParens: 'always',
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 400,
      },
    },
  ],
};