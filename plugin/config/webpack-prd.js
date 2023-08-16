const baseConfig = require('./webpack-base')
const { merge } = require('webpack-merge')
const configHandler = require('../configHandler')

module.exports = function (cliOptions) {
  const config = configHandler(cliOptions)
  return merge(baseConfig(cliOptions), {
    devtool: config.sourceMap ? 'source-map' : 'none',
    mode: 'production',
  })
}
