const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (env) {
  return merge(common(env), {
    devtool: 'inline-source-map',
    devServer: {
      // hotOnly: true,
      hot: true,
      contentBase: '../dist',
      // port: 9000
      proxy: {
        // '/api/': {
        //   target: '',
        //   changeOrigin: true,
        //   pathRewrite: { '^/api/admin': '/admin' },
        // }
      }
    },
    module: {
      rules: [
        {
          test: /\.(le|c)ss$/,
          use: ["style-loader", "css-loader", 'postcss-loader', "less-loader"]
        },
      ]
    },
    plugins: [
      // 当引用 react 时，链接到生成的 dll 文件中，而不再从 node_module 中读取
      new DllReferencePlugin({
        // 描述 react 动态链接库的文件内容
        manifest: require(path.resolve(__dirname, '../static/dll', 'react.manifest.json')),
      }),
      // 将提前打包的 dll 文件夹放到 dist 目录下
      // 还有一种思路就是直接把 dll 输出到 dist 下，然后配置 CleanWebpackPlugin 忽略对 dll 的处理
      new CopyWebpackPlugin([
        { from: path.resolve(__dirname, '../static/dll'), to: './dll' }
      ]),
      // 在 html 中插入对 react 的引用
      new HtmlWebpackTagsPlugin({
        tags: [
          './dll/react.dll.js'
        ],
        append: false
      }),
    ]
  });
}