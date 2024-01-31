module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: 'vuetify',
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/singleline-html-element-content-newline': 0,
    'space-before-function-paren': 0,
    // 'camel-case': 'warn',
    camelcase: 'off',
    'dot-notation': 'off',
    'no-unused-vars': 'off',
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
}
