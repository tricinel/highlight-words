module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.base.json'
  },
  plugins: ['jest', '@typescript-eslint', 'prettier'],
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:jest/recommended',
    'frontwerk-typescript',
    'plugin:import/typescript',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': 'error'
  }
};
