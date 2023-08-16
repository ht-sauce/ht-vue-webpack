const webpackDev = require('./config/webpack-dev')
const webpackPrd = require('./config/webpack-prd')
const configHandler = require('./configHandler')

/*
 * @param {Object} cliOptions合并配置
 * @param {Object} cliOptions.extractConfig 抽离配置，方便一些简单的配置，比如publicPath的配置，不然webpack的配置太繁琐了
 * @param {Object} cliOptions.webpackMergeConfig 通过webpack-merge合并的配置，会覆盖extractConfig传入的数据
 * */
module.exports = (cliOptions = {}) => {
  const config = configHandler(cliOptions)
  const { isPrd } = config
  if (isPrd) {
    return webpackPrd(cliOptions)
  } else {
    return webpackDev(cliOptions)
  }
}
