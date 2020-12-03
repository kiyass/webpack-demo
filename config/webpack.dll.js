const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, '../static/dll'), //放在项目的dll目录下面
    filename: '[name].dll.js', //打包文件的名字
    library: '_dll_[name]' //可选 暴露出的全局变量名

    // 主要是给DllPlugin中的name使用，
    // 故这里需要和webpack.DllPlugin中的`name: '[name]_dll',`保持一致。
  },
  plugins: [

    // 生成映射文件
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '../static/dll', '[name].manifest.json'),
      name: '_dll_[name]'
    })
  ]
};
