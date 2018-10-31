module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'never'],
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'max-len': 'off',
    'import/extensions': 'off',
    'no-return-assign': 'off',
    'no-mixed-operators': 'off',
    'func-names': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
