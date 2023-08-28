const webpackBase = require('ht-vue-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
module.exports = webpackBase(() => {
  return {
    webpackMergeConfig: {
      plugins: [new VueLoaderPlugin()],
    },
    extractConfig: {
      vue2: true,
      port: 5000,
      gzip: false,
    },
  }
})
