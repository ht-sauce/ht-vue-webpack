const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const proxy = require('http-proxy-middleware').createProxyMiddleware // 代理处理
const app = express()
const config = require('../webpack.config.js')
const compiler = webpack(config)

// 告知 express 使用 webpack-dev-middleware，
// 以及将 webpack.config.js 配置文件作为基础配置。

//express框架，前边肯定都是必要的，也就是只需安装compression组件，然后添加一下两句代码就好
const compression = require('compression')
app.use(compression())

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath, // 解决图标路径问题
  }),
)
// 代理配置
// app.use('/api', proxy({ target: 'http://localhost:8080', changeOrigin: true }))

const port = 3000
// 将文件 serve 到 port 3000。
app.listen(port, function () {
  console.log(`http://localhost:${port}`)
})
