module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  env: {
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended', // Make sure this is always the last element in the array.
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.base.json',
    extraFileExtensions: ['.css', '.svg'],
    ecmaVersion: 13,
  },
  settings: {
    jest: {
      version: 27,
    },
  },
  plugins: ['simple-import-sort', 'prettier', 'jest'],
  rules: {
    'react/jsx-filename-extension': 'off',
    'import/prefer-default-export': 'off',
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
  },
}
