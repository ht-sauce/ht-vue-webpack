const webpackBase = require('ht-vue-webpack-plugin')

module.exports = webpackBase(() => {
  return {
    extractConfig: {
      port: 5500,
      gzip: false,
    },
    finalWebpackOptions(config) {
      console.log('finalWebpackOptions', config)
      return config
    },
  }
})
