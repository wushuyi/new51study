const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractBulma = new ExtractTextPlugin('bulma.css');
const extractNprogress = new ExtractTextPlugin('nprogress.css');

module.exports = {
  entry: ['./libs/bulma/bulma.sass', './libs/nprogress/0.2.0/nprogress.scss'],
  output: {
    filename: 'bulma.css',
    path: path.resolve(__dirname, 'static/styles')
  },
  plugins: [
    extractBulma,
    extractNprogress,
  ],
  module: {
    rules: [
      {
        test: /bulma\.sass/,
        use: extractBulma.extract([
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
};