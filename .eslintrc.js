module.exports = {
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
    project: './tsconfig.json',
    ecmaVersion: 13,
  },
  plugins: ['simple-import-sort', 'prettier', 'jest'],
  rules: { 'react/jsx-filename-extension': 'off' },
}