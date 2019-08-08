const merge = require('webpack-merge');

const baseConfig = require('./webpack.main.config');

module.exports = merge.smart(baseConfig, {
  mode: 'production',
  devtool: false,
  target: 'electron-main',
});
