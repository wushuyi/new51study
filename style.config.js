const path = require('path')
const glob = require('glob')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractCustom = new ExtractTextPlugin('custom.css')
const extractNprogress = new ExtractTextPlugin('nprogress.css')

module.exports = {
  entry: ['./libs/style/nprogress.scss', './libs/style/custom.scss'],
  output: {
    filename: 'noop.js',
    path: path.resolve(__dirname, 'static/styles')
  },
  plugins: [
    extractCustom,
    extractNprogress,
  ],
  module: {
    rules: [
      {
        test: /custom\.scss/,
        use: extractCustom.extract([
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ])
      },
      {
        test: /nprogress\.scss/,
        use: extractNprogress.extract([
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ])
      }
    ]
  }
}