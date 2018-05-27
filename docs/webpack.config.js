const path = require('path')

module.exports = {
  entry: './docs/index.js',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, './')
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.(svg)$/,
        loader: 'svg-url-loader',
        options: { noquotes: true }
      }
    ]
  }
}
