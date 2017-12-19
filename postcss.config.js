const buildStyle = !!process.env.BUILD_STYLE

const autoprefixer = require('autoprefixer')({
  browsers: [
    '>1%',
    'last 4 versions',
    'Firefox ESR',
    'not ie < 9', // React doesn't support IE8 anyway
  ]
})

let plugins = [
  require('postcss-easy-import')({prefix: '_'}), // keep this first
]

if (buildStyle) {
  plugins.push(autoprefixer)
}

module.exports = {
  plugins: plugins
}
