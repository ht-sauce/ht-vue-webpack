const { resolvePath, rootToStrNull } = require('../util/handlerPath.js')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const configHandler = require('../configHandler')
const Dotenv = require('dotenv-webpack')
const { getEnvPath } = require('../util/env')
const { getMode } = require('../util/argv')
const { vueEsm } = require('../util/vueTool')

const babelLoaderConf = (extractConfig) => {
  return {
    loader: 'babel-loader',
    options: {
      presets: extractConfig.vue2
        ? ['@babel/preset-env', '@vue/babel-preset-jsx']
        : ['@babel/preset-env'],
      plugins: extractConfig.vue2 ? [] : ['@vue/babel-plugin-jsx'],
      cacheDirectory: true, // babel编译后的内容默认缓存在 node_modules/.cache/babel-loader
      ...extractConfig.options.babel,
    },
  }
}

/*
 * @param {Object} cliOptions合并配置
 * @param {Object} cliOptions.extractConfig 抽离配置，方便一些简单的配置，比如publicPath的配置，不然webpack的配置太繁琐了
 * @param {Object} cliOptions.webpackMergeConfig 通过webpack-merge合并的配置，会覆盖extractConfig传入的数据
 * @param {Function} cliOptions.finalWebpackOptions 项目的publicPath
 * */
module.exports = (cliOptions = {}) => {
  const { webpackMergeConfig } = cliOptions
  // 最终合并的配置
  let finalWebpackOptions = cliOptions.finalWebpackOptions
    ? cliOptions.finalWebpackOptions
    : (webpackConfig) => {
        return webpackConfig
      }
  const extractConfig = configHandler(cliOptions)
  // 没有尝试过，为了拓展性，将已经配置好的数据，最终通过finalWebpackOptions对外暴露
  // 对拓展性的帮助
  return finalWebpackOptions(
    merge(
      {
        plugins: [
          new Dotenv({
            path: getEnvPath(cliOptions, getMode()),
          }),
          // 请确保引入这个插件
          extractConfig.vue2 ? false : new VueLoaderPlugin(),
          new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[id].[contenthash].css',
            ignoreOrder: true,
          }),
          // 注入的全局变量
          new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: 'true',
            __VUE_PROD_DEVTOOLS__: 'false',
            BASE_URL: JSON.stringify(rootToStrNull(extractConfig.publicPath)), // 注入基本信息
          }),
          new CopyPlugin({
            patterns: [
              {
                from: resolvePath(extractConfig.publicDir),
                to: resolvePath(extractConfig.distDir), // 输出目录
                toType: 'dir',
                noErrorOnMissing: true,
                globOptions: {
                  dot: true,
                  gitignore: true,
                  ignore: ['**/index.html'],
                },
                info: {
                  minimized: true,
                },
              },
            ],
          }),
          new HtmlWebpackPlugin({
            template: `./${extractConfig.publicDir}/index.html`,
          }),
          new webpack.ProgressPlugin({
            handler(percentage, message, ...args) {
              console.info((percentage * 100).toFixed(2) + '%', message, ...args)
            },
          }),
        ],
        entry: './src/main', // 忽略后缀名
        cache: true,

        output: {
          publicPath: extractConfig.publicPath, // 公共路径
          filename: 'js/[name].[chunkhash].js',
          path: resolvePath(extractConfig.distDir), // 输出目录
          clean: true,
        },
        resolve: {
          extensions: ['.js', '.ts', '.tsx', '.jsx', '.vue'],
          alias: {
            '@': resolvePath('./src'),
            // runtimeCompiler, 是否使用包含运行时编译器的 Vue 构建版本
            // 同时解决el-table渲染不出来的问题
            vue$: vueEsm(extractConfig.vue2, extractConfig.runtimeCompiler),
          },
        },
        optimization: {
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
              },
            },
          },
        },
        module: {
          rules: [
            {
              test: /\.vue$/,
              loader: 'vue-loader',
              options: {
                reactivityTransform: true,
                ...extractConfig.options.vue,
              },
            },
            {
              test: /\.(ts|tsx)$/,
              exclude: /node_modules/,
              use: [
                babelLoaderConf(extractConfig),
                {
                  loader: 'ts-loader',
                  options: {
                    transpileOnly: true, // 关闭类型检查，即只进行转译
                    // 注意如果不用jsx则使用该配置，删除appendTsxSuffixTo，
                    // appendTsSuffixTo: ['\\.vue$'],
                    // 使用jsx则使用该配置，删除appendTsSuffixTo，
                    appendTsxSuffixTo: ['\\.vue$'],
                    ...extractConfig.options.ts,
                  },
                },
              ],
            },
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              use: [babelLoaderConf(extractConfig)],
            },
            // css处理部分
            {
              test: /\.css$/,
              use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
            {
              test: /\.s[ac]ss$/i,
              use: [
                // 需要注意loader加载顺序
                // 'style-loader', // 顺序1，把css插入到head标签中
                MiniCssExtractPlugin.loader, // 顺序1，把css提取到单独的文件中
                'css-loader',
                'postcss-loader', // 顺序最后
                // 将 Sass 编译成 CSS
                {
                  // 配置方式参考：https://juejin.cn/post/7251158799317860407
                  // 解决sass打包el-icon乱码
                  loader: 'sass-loader',
                  options: {
                    implementation: require('sass'),
                    sassOptions: {
                      outputStyle: 'expanded',
                    },
                    ...extractConfig.options.sass,
                  },
                },
              ],
            },
            {
              test: /\.less$/i,
              use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader', // 顺序最后
                {
                  loader: 'less-loader',
                  options: {
                    ...extractConfig.options.less,
                  },
                },
              ],
            },
            // 静态资源处理部分
            {
              // svg不可以base64编码，影响实际图片展示
              test: /\.(svg)(\?.*)?$/,
              type: 'asset/resource',
              generator: {
                filename: 'img/[name].[hash:8][ext]',
              },
            },
            {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
              type: 'asset',
              generator: {
                filename: 'fonts/[name].[hash:8][ext]',
              },
            },
            {
              test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
              type: 'asset',
              generator: {
                // [ext]前面自带"."
                filename: 'img/[name].[hash:8][ext]',
              },
            },
            {
              test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
              type: 'asset',
              generator: {
                filename: 'media/[name].[hash:8][ext]',
              },
            },
          ],
        },
      },
      webpackMergeConfig ? webpackMergeConfig : {},
    ),
  )
}
