const { merge } = require('webpack-merge');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const baseConfig = require('./webpack.renderer.config');

let plugins = [];
if (process.env.analyzer) {
    plugins = [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'bundleReport.html',
            logLevel: 'info'
        })
    ];
}

module.exports = merge(baseConfig, {
    mode: 'production',
    devtool: false,
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            cacheGroups: {
                default: false,
                vendors: false,
                vendor: {
                    name: 'vendor',
                    test: /node_modules/,
                    priority: 20
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    priority: 10,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    },
    output: {
        filename: '[name].[contentHash].js',
        chunkFilename: '[name].[contentHash].chunk.js'
    },
    plugins
});
