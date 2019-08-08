const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const baseConfig = require('./webpack.base.config');

module.exports = merge.smart(baseConfig, {
    target: 'electron-renderer',
    entry: {
        app: './src/renderer/index.js'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, '../src/renderer')],
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'fonts/[name]--[folder].[ext]'
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            utils: path.resolve(__dirname, '../src/renderer/utils/'),
            components: path.resolve(__dirname, '../src/renderer/components/'),
            stores: path.resolve(__dirname, '../src/renderer/stores/'),
            api: path.resolve(__dirname, '../src/renderer/api/'),
            assets: path.resolve(__dirname, '../src/renderer/assets/'),
            root: path.resolve(__dirname, '../'),
            '@': path.resolve(__dirname, '../src/renderer/')
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new HtmlWebpackPlugin({
            template: 'src/renderer/index.html'
        })
    ]
});
