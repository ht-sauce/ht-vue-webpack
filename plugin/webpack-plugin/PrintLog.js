const { rootToStrNull } = require('../util/handlerPath.js')
// PrintLog.js，打印日志

const { getIp } = require('../util/os')
// 一个 JavaScript 类
module.exports = class PrintLog {
  apply(compiler) {
    compiler.hooks.done.tap('PrintLog', (stats) => {
      if (stats.hasErrors()) {
        return
      }
      const IPv4 = getIp().IPv4

      // console.log(stats.compilation)
      const port = stats.compilation.options?.devServer?.port
      const publicPath = rootToStrNull(stats.compilation.options?.output?.publicPath)

      // 延迟输出，让提示信息在最后输出
      setTimeout(() => {
        console.log('服务地址')
        console.log(`本地：http://localhost:${port}/${publicPath}`)
        console.log(`IPV4：http://${IPv4}:${port}/${publicPath}`)
      })
    })
  }
}
