const baseConfig = require('./webpack-base')
const { merge } = require('webpack-merge')
const { rootToStrNull, resolvePath } = require('../util/handlerPath.js')
const configHandler = require('../configHandler')
const PrintLog = require('../webpack-plugin/PrintLog')
module.exports = function (cliOptions) {
  const extractConfig = configHandler(cliOptions)
  return merge(baseConfig(cliOptions), {
    plugins: [new PrintLog()],
    mode: 'development',
    devtool: 'inline-cheap-module-source-map',
    optimization: {
      runtimeChunk: 'single',
    },
    devServer: {
      host: '0.0.0.0',
      // history路由配置
      historyApiFallback: {
        disableDotRule: true,
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
        rewrites: [
          // 页面匹配规则
          {
            from: /^\/$/,
            to: `${rootToStrNull(extractConfig.publicPath)}/index.html`,
          },
          {
            from: /./,
            to: `${rootToStrNull(extractConfig.publicPath)}/index.html`,
          },
        ],
      },
      // 静态资源目录
      static: {
        directory: resolvePath(extractConfig.publicDir),
        publicPath: extractConfig.publicPath,
      },
      // 代理
      proxy: {},
      // 改变端口
      port: extractConfig.port,
      hot: 'only', // 防止 error 导致整个页面刷新
      open: false, // 不打开浏览器
      client: {
        progress: true,
      },
    },
  })
}
