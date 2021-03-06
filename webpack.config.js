const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './js/cart.js',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      // { test: /\.svg$/, use: 'svg-inline-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(js)$/, use: 'babel-loader' },
    ],
  },
  output: {
    path: path.join(process.cwd(), 'public', 'js'),
    filename: 'cart.js',
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
};
