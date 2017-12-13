const path = require('path')
const glob = require('glob')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const {ANALYZE} = process.env

module.exports = {
  transpileModules: [
    /rmc-cascader/
  ],
  webpack: function (config, {dev}) {

    config.module.rules.push(
      {
        test: /\.(css|s[a|c]ss)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              extends: path.resolve(__dirname, './.stylerc'),
            },
          },
          'styled-jsx-css-loader',
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
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              precision: 8,
              // includePaths: ['styles', 'node_modules']
              //     .map((d) => path.join(__dirname, d))
              //     .map((g) => glob.sync(g))
              //     .reduce((a, c) => a.concat(c), [])
            }
          }
        ]
      }
    )

    if (ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true
      }))
    }

    return config
  }
}