module.exports = {
  root: false,
  env: {
    node: true,
    jquery: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/script-indent': ['error', 2, { 'baseIndent': 1, 'switchCase': 1 }],
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    //  结尾有分号
    'semi': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      'files': ['*.vue'],
      'rules': {
        'indent': 'off'
      }
    }
  ]
}
