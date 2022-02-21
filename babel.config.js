// module.exports = {
//   presets: [
//     '@vue/cli-plugin-babel/preset',
//   ]
// }
// module.exports = { presets: [ ['@vue/app', {
//   debug: true,
//   polyfills: [ 'es6.promise', 'es6.array.find-index', 'es7.array.includes', 'es6.string.includes' ]
// } ] ] }
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        'corejs': {
          version: 3,
          proposals: true
        },
        'useBuiltIns': 'entry'
      }
    ]
  ],
  plugins: [
    'lodash',
    [
      'import',
      {
        libraryName: 'Antd',
        libraryDirectory: 'es',
        style: true // true` 会加载 less 文件'css'
      }
    ],
    ['@babel/plugin-transform-runtime']
  ]
}
