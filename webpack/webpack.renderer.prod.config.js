const merge = require('webpack-merge');
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
                    test: /react/,
                    minSize: 0,
                    minChunks: 1,
                    enforce: true,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins
});
