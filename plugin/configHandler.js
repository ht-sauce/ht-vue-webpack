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
    isPrd: false, // 是否是生产环境
  }
  return {
    ...baseConfig,
    ...cliOptions.extractConfig,
  }
}
