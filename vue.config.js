
// const vueEnv = process.env.VUE_APP_STRUCTURE
const webpack = require('webpack')
// const Timestamp = new Date().getTime()
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false, // vueEnv === 'Beta' || process.env.NODE_ENV !== 'production',
  publicPath: '/',
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@node_module', resolve('node_modules'))
  },
  configureWebpack: {
    plugins: [new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/,
      /zh-cn/
    ),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    })]
    // output: {
    //   filename: `js/[name]_${Timestamp}.js`,
    //   chunkFilename: `js/[name]_${Timestamp}.js`
    // }
  },
  css: {
    extract: false,
    sourceMap: false,
    loaderOptions: { // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true
      }
    }
  }
}
