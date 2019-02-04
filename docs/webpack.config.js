const path = require('path')

module.exports = {
  mode: 'production',
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
          presets: ['@babel/react']
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
