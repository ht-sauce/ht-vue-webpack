# vue-cli-webpack
个人webpack构建基础搭建，用以替代被官方抛弃的vuecli
## 使用方式
引入@ht-vue-webpack/plugin
## npm
```shell
npm i ht-vue-webpack-plugin -D
```
在项目根目录下创建webpack.config.js
```javascript
const webpackBase = require('ht-vue-webpack-plugin')
// mode是你--mode后面的参数，env是你的环境参数
// 入参可以是一个函数也可以是一个对象
module.exports = webpackBase((mode, env = process.env) => {
  return {
      // 工具包抽离的配置
      extractConfig: {
          // 请看下方默认值
      },
      // 最终通过webpack-merge合并的配置
      webpackMergeConfig: {
          // 参考webpack官方文档
      }
  }
})
```
package.json中添加
```json
{
  "scripts": {
    "dev": "webpack serve --mode development", // 开发环境
    "build": "webpack build --mode production", // 生产环境
    // eslint检测
    "lint": "eslint play --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
  }
}
```
webpackBase入参文件参考，以下为默认配置
```javascript  
/*
 * @param {Object} cliOptions合并配置
 * @param {Object} cliOptions.extractConfig 抽离配置，方便一些简单的配置，比如publicPath的配置，不然webpack的配置太繁琐了
 * @param {Object} cliOptions.webpackMergeConfig 通过webpack-merge合并的配置，会覆盖extractConfig传入的数据
 * */
module.exports = function (cliOptions = { extractConfig: {} }) {
  const baseConfig = {
  // 环境配置地址，在webpackBase执行的时候会运行dotenv包，加载配置文件参数，使用process.env.{你的参数}
  // 默认从根目录下的.env文件中加载环境变量配置，配置方式参考vuecli方式
    env: './env',
    port: 8000, // 端口
    publicPath: '/', // 公共路径，和vuecli一样
    distDir: 'dist', // 输出目录
    publicDir: 'public', // 静态资源目录
    sourceMap: true, // 生产是否开启 sourceMap
  }
  return {
    ...baseConfig,
    ...cliOptions.extractConfig,
  }
}
```
## 核心原理
提供webpack基本配置，通过webpack-merge合并用户配置，最后返回webpack配置
