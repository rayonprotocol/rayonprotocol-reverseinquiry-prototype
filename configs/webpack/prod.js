// production config
const merge = require('webpack-merge');
const {
  resolve
} = require('path');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  entry: './index.tsx',
  output: {
    filename: 'js/bundle.[chunkhash].min.js',
    path: resolve(__dirname, '../../dist'),
    publicPath: '/',
  },
  plugins: [],
});
