const webpackDev = require('./config/webpack-dev')
const webpackPrd = require('./config/webpack-prd')
const { loaderEnv } = require('./util/env')

const { getMode, isBuild, isServe } = require('./util/argv')

/*
 * @param {function} cliOptions(config),返回参数参考下面的注释
 *  config mode,当前mode值
 *
 * @param {Object} cliOptions合并配置
 * @param {Object} cliOptions.extractConfig 抽离配置，方便一些简单的配置，比如publicPath的配置，不然webpack的配置太繁琐了
 * @param {Object} cliOptions.webpackMergeConfig 通过webpack-merge合并的配置，会覆盖extractConfig传入的数据
 * @param {Function} cliOptions.finalWebpackOptions 项目的publicPath
 * */
module.exports = (cliOptions = {}) => {
  // mode值代表了env文件的名称
  const mode = getMode()
  if (typeof cliOptions === 'function') {
    cliOptions = cliOptions({ mode, env: process.env })
  }
  // console.log(cliOptions)

  loaderEnv(cliOptions, mode) // 加载环境变量，首位

  // 内部判断是否生产构建，可以被webpackMergeConfig覆盖
  const build = isBuild()
  const serve = isServe()

  // 生产构建
  if (build) return webpackPrd(cliOptions)
  // dev运行
  if (serve) return webpackDev(cliOptions)
}
