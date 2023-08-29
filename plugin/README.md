_# vue-cli-webpack
个人webpack构建基础搭建，用以替代被官方抛弃的vuecli

不了解的可以访问项目https://github.com/ht-sauce/ht-vue-webpack/tree/main

其中play文件为vue3版本，play-vue2为vue2版本，可以参考
## 使用方式和npm
小伙伴也可以查看源代码，自己搭建，这里只是提供一个基础的构建方式，方便大家快速搭建项目
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
      },
      // 最终webpack配置完成后的回调，会返回最终的webpack配置
      // 可以不定义，定义的话会返回最终的webpack配置
      finalWebpackOptions: (finalConfig) => {
          // 一定要最终进行返回
          return finalConfig
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

实际情况请以
[configHandler.js](https://github.com/ht-sauce/ht-vue-webpack/blob/main/plugin/configHandler.js)
为准
```javascript  
/*
 * @param {Object} cliOptions合并配置
 * @param {Object} cliOptions.extractConfig 抽离配置，方便一些简单的配置，比如publicPath的配置，不然webpack的配置太繁琐了
 * @param {Object} cliOptions.webpackMergeConfig 通过webpack-merge合并的配置，会覆盖extractConfig传入的数据
 * */
module.exports = function (cliOptions = { extractConfig: {} }) {
    const baseConfig = {
        /*是否使用vue2
         * 当使用vue2需要手动设置vueJsx和vue-loader15办
         * */
        vue2: false,
        env: './env', // 环境配置地址
        gzip: false, // 是否开启gzip
        port: 8000, // 端口
        publicPath: '/', // 公共路径
        distDir: 'dist', // 输出目录
        publicDir: 'public', // 静态资源目录
        sourceMap: true, // 是否开启 sourceMap
        runtimeCompiler: false, // 是否使用运行时编译器
        // 一些必要的options配置，当无法处理的时候建议通过webpackMergeConfig或者finalWebpackOptions进行最终处理
        options: {
            sass: {
                // additionalData: `
                //     @use "~@/styles/element/index.scss" as *; // 按需加载修改主题色
                //   `,
            },
            // vue-loader
            vue: {},
            // ts-loader
            ts: {},
            // babel-loader
            babel: {}
        },
    }
    return {
        ...baseConfig,
        ...cliOptions.extractConfig,
    }
}
```
## 区分环境
通过配置文件env指定读取文件所在地址，默认读取根目录下env文件夹下的.env文件

使用 --mode [文件名称] 指定文件下面读取的配置文件后即可使用process.env.[自定义变量]

关于构建和打包，除非使用webpackMergeConfig进行改变webpack内mode变量，否则构建的时候采用区分webpack serve或build方式进行区分构建生产还是运行开发环境

不会再出现vuecli那种会修改到NODE.ENV的情况，同时我这里也没有NODE.ENV
## 核心原理
提供webpack基本配置，通过webpack-merge合并用户配置，最后返回webpack配置
## vue2的使用
安装vue-loader@15.x 版本
```shell
npm i vue-loader@15.x -D
```
配置文件修改
```javascript
const webpackBase = require('ht-vue-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
module.exports = webpackBase(() => {
    return {
        webpackMergeConfig: {
            plugins: [new VueLoaderPlugin()], // 修改插件
        },
        extractConfig: {
            vue2: true, // 需要开启
            port: 5000,
            gzip: false,
        },
    }
})
```

