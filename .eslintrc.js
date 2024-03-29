module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'never'],
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'max-len': 'off',
    'import/extensions': 'off',
    'no-return-assign': 'off',
    'no-mixed-operators': 'off',
    'func-names': 'off',
    'import/no-cycle': 'off',
    'vue/no-use-v-if-with-v-for': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
