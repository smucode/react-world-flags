const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/Flag.js',
  output: {
    libraryTarget: 'umd',
    library: 'react-world-flags',
    filename: 'react-world-flags.js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
  },
  externals: {
    react: 'umd react',
    'react-dom': 'umd react-dom',
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
