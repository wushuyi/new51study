const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = {
  entry: ['./exportForm'],
  output: {
    filename: 'exportForm.dist.js',
    path: path.resolve(__dirname, './dist'),
    // library: 'webpackNumbers',
    libraryTarget: 'commonjs2',
  },
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  module: {
    rules: [
      {
        test: /\.js(\?[^?]*)?$/,
        exclude: function (str) {
          return /node_modules/.test(str)
        },
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              extends: path.resolve(__dirname, './.exportrc'),
            },
          },
        ],
      },
      {
        test: /\.s[a|c]ss$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              extends: path.resolve(__dirname, './.stylerc'),
            },
          },
          'styled-jsx-css-loader',
          {
            loader: 'sass-loader',
            options: {
              precision: 8,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new webpack.optimize.ModuleConcatenationPlugin()
  ]
}