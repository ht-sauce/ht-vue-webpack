const express = require('express')
const proxy = require('http-proxy-middleware').createProxyMiddleware // 代理处理
const app = express()
const path = require('path')
const fs = require('fs')

// 代理配置
// app.use('/api', proxy({ target: 'http://localhost:8080', changeOrigin: true }))

console.log(path.join(process.cwd(), '/dist/index.html'))
// 访问静态资源
app.use(express.static(path.join(process.cwd(), '/dist')))
app.get('*', function (req, res) {
  const html = fs.readFileSync(path.join(process.cwd(), '/dist/index.html'), 'utf-8')
  res.send(html)
})

const port = 3000
// 将文件 serve 到 port 3000。
app.listen(port, function () {
  console.log(`http://localhost:${port}`)
})
