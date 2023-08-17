const { resolvePath, rootToStrNull } = require('../utils')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const configHandler = require('../configHandler')
const Dotenv = require('dotenv-webpack')

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
          path: resolvePath(`${extractConfig.env}/.env`),
          safe: false,
          allowedEmptyValues: true,
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
        extensions: ['.js', '.ts', '.tsx', '.jsx'],
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
            test: /\.(js|ts)x?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true,
                },
              },
            ],
          },
          // css处理部分
          {
            test: /\.(css|scss|sass|less)$/,
            use: [
              // 需要注意loader加载顺序
              // 'style-loader', // 顺序1，把css插入到head标签中
              MiniCssExtractPlugin.loader, // 顺序1，把css提取到单独的文件中
              'css-loader',
              'sass-loader',
              'postcss-loader', // 顺序最后
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
