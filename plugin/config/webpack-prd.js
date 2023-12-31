const baseConfig = require('./webpack-base')
const { merge } = require('webpack-merge')
const configHandler = require('../configHandler')
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = function (cliOptions) {
  const config = configHandler(cliOptions)
  return merge(baseConfig(cliOptions), {
    plugins: [
      config.gzip && new CompressionPlugin({
        // filename: "[path][base].gz", // 这种方式是默认的，多个文件压缩就有多个.gz文件，建议使用下方的写法
        // filename: '[path].gz[query]', //  使得多个.gz文件合并成一个文件，这种方式压缩后的文件少，建议使用
        algorithm: 'gzip', // 官方默认压缩算法也是gzip
        test: /\.js$|\.css$|\.html$|\.ttf$|\.eot$|\.woff$/, // 使用正则给匹配到的文件做压缩，这里是给html、css、js以及字体（.ttf和.woff和.eot）做压缩
        threshold: 10240, //以字节为单位压缩超过此大小的文件，使用默认值10240吧
        minRatio: 0.8, // 最小压缩比率，官方默认0.8
        //是否删除原有静态资源文件，即只保留压缩后的.gz文件，建议这个置为false，还保留源文件。以防：
        // 假如出现访问.gz文件访问不到的时候，还可以访问源文件双重保障
        deleteOriginalAssets: false
      })
    ],
    devtool: config.sourceMap ? 'source-map' : 'none',
    mode: 'production',
  })
}
