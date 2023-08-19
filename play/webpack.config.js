const webpackBase = require('ht-vue-webpack-plugin')

module.exports = webpackBase(() => {
  return {
    extractConfig: {
      port: 5000,
    },
  }
})
