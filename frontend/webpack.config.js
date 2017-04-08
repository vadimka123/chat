var path = require('path');
var webpack = require('webpack');

var NODE_ENV = process.env.NODE_ENV;
var ENTRY = process.env.ENTRY;

module.exports = {
  devtool: 'eval',
  entry: [ENTRY],
  output: {path: __dirname, filename: 'build/build.js', publicPath: '/'},
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
            presets: ['es2015', 'react', 'stage-0'],
            plugins: [
                'transform-runtime',
                'transform-decorators-legacy',
                'transform-class-properties'
            ]
        }
    },
    {
      test: /\.css/,
      loaders: ["style-loader", "css-loader"]
    }]
  }
};
