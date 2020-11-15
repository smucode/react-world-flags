const path = require('path')

module.exports = {
  mode: 'production',
  entry: './docs/index.js',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, './'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(svg)$/,
        loader: 'svg-url-loader',
        options: { noquotes: true },
      },
    ],
  },
}
