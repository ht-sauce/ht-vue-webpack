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

const babelLoaderConf = {
  loader: 'babel-loader',
  options: {
    presets: [
      '@babel/preset-env',
      // [
      //   '@babel/preset-typescript',
      //   {
      //     allExtensions: true, // 支持所有文件扩展名
      //   },
      // ],
    ],
    plugins: ['@vue/babel-plugin-jsx'],
    cacheDirectory: true, // babel编译后的内容默认缓存在 node_modules/.cache/babel-loader
  },
}

/*
 * @param {Object} cliOptions合并配置
 * @param {Object} cliOptions.extractConfig 抽离配置，方便一些简单的配置，比如publicPath的配置，不然webpack的配置太繁琐了
 * @param {Object} cliOptions.webpackMergeConfig 通过webpack-merge合并的配置，会覆盖extractConfig传入的数据
 * */
module.exports = (cliOptions = {}) => {
  const { webpackMergeConfig } = cliOptions
  const extractConfig = configHandler(cliOptions)
  return merge(
    {
      plugins: [
        new Dotenv({
          path: getEnvPath(cliOptions, getMode()),
        }),
        // 请确保引入这个插件
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash].css',
          chunkFilename: 'css/[id].[contenthash].css',
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
            },
          },
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: [
              babelLoaderConf,
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true, // 关闭类型检查，即只进行转译
                  // 注意如果不用jsx则使用该配置，删除appendTsxSuffixTo，
                  // appendTsSuffixTo: ['\\.vue$'],
                  // 使用jsx则使用该配置，删除appendTsSuffixTo，
                  appendTsxSuffixTo: ['\\.vue$'],
                },
              },
            ],
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [babelLoaderConf],
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
              'sass-loader',
            ],
          },
          // 静态资源处理部分
          {
            test: /\.(eot|svg|ttf|woff|)$/,
            type: 'asset/resource',
            generator: {
              filename: 'fonts/[name].[hash:8][ext]',
            },
          },
          {
            test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
            type: 'asset',
            generator: {
              // [ext]前面自带"."
              filename: 'assets/[name].[hash:8][ext]',
            },
            parser: {
              dataUrlCondition: {
                maxSize: 4 * 1024, // 4kb
              },
            },
          },
        ],
      },
    },
    webpackMergeConfig ? webpackMergeConfig : {},
  )
}
