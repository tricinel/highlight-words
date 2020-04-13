module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.base.json'
  },
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  env: {
    browser: true,
    node: true
  },
  extends: [
    'frontwerk-typescript',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unsafe-assignment': 'off', // This is too new as of this commit
    'prettier/prettier': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ]
  }
};
