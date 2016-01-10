var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.resolve('src'),
  devtool: "source-map",
  entry: {
    'semantic-ui-angular': './index',
    'semantic-ui-angular.min': './index'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],
  module: {
    loaders: [
      { test: /\.ts?$/, loader: 'ts-loader' }
    ]
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  }
};
