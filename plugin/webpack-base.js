const { resolvePath } = require('./utils')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  plugins: [
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css',
    }),
    // 注入的全局变量
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      BASE_URL: JSON.stringify('/vue-webpack'), // 注入基本信息
    }),
    new CopyPlugin({
      patterns: [
        {
          from: resolvePath('public'),
          to: resolvePath('dist'), // 输出目录
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
      template: './public/index.html',
    }),
  ],
  entry: './src/main.ts',
  target: 'web',
  mode: 'development', // 'development' | 'production'
  output: {
    publicPath: '/vue-webpack', // 公共路径
    filename: 'js/[name].[chunkhash].js',
    path: resolvePath('dist'), // 输出目录
    clean: true,
  },
  devServer: {
    compress: true, // gzip压缩
    // history路由配置
    historyApiFallback: {
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
      rewrites: [
        // 页面匹配规则
        { from: /^\/$/, to: '/vue-webpack/index.html' },
        { from: /./, to: '/vue-webpack/index.html' },
      ],
    },
    // 静态资源目录
    static: {
      directory: resolvePath('public'),
      publicPath: '/vue-webpack',
    },
    // 代理
    proxy: {},
    // 改变端口
    port: 6000,
    hot: true,
    open: false, // 不打开浏览器
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
      logging: 'none',
      progress: true,
    },
  },
  // 优化
  optimization: {
    runtimeChunk: true,
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    // version: process.env.NODE_ENV,
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    alias: {
      '@': resolvePath('./src'),
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
}
