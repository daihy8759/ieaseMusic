const merge = require('webpack-merge');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const baseConfig = require('./webpack.renderer.config');

module.exports = merge.smart(baseConfig, {
    mode: 'production',
    devtool: false,
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        splitChunks: {
            chunks: 'initial',
            cacheGroups: {
                priority: '0',
                vendor: {
                    chunks: 'initial',
                    test: /react|lodash/,
                    minSize: 0,
                    minChunks: 1,
                    enforce: true,
                    reuseExistingChunk: true
                }
            }
        }
    }
});
