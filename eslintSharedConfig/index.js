module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'plugin:jest/recommended',
    'prettier',
  ],

  parserOptions: {
    ecmaVersion: 13,
  },

  settings: {
    jest: {
      version: 27,
    },
    react: {
      version: '17',
    },
  },

  plugins: ['sonarjs', 'jest'],

  rules: {
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',

    'import/prefer-default-export': 'off',

    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
  },
}
