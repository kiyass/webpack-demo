const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require('webpack');

module.exports = function (env) {
  return merge(common(env), {
    optimization: {
      // concatenateModules: true,  // Scope Hosting, production 默认开启
      minimizer: [
        new TerserJSPlugin({}),
        new OptimizeCSSAssetsPlugin({})
      ],
      splitChunks: {
        minSize: 0, // 打包文件最小尺寸
        cacheGroups: {  // 可以自定义指定多个，如果是多页面，配置后需要在htmlWebpackPlugins对应的chunks中引入
          commons: {
            test: /(react|react-dom)/,  // 单独抽取react|react-dom打成一个包
            name: "commons",
            chunks: "all",
            priority: -10   // 值越大,优先级越高.模块先打包到优先级高的组里
          },
          vendors: {
            name: "vendors",
            chunks: "all",
            minChunks: 2, // 将引用次数大于等于两次的引用打成一个包
            priority: -20,
            reuseExistingChunk: true  //如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
          }
        }
      },
      runtimeChunk: { name: 'manifest' }
    },
    plugins: [
      // 提取css为独立的文件
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:7].css',
        chunkFilename: '[id].[contenthash:7].css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(le|c)ss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", 'postcss-loader', "less-loader"]
        }
      ]
    }
  });
}

