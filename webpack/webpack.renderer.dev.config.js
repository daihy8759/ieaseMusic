const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { spawn } = require('child_process');

const baseConfig = require('./webpack.renderer.config');

module.exports = merge.smart(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    entry: ['react-hot-loader/patch', './src/renderer/index.js'],
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                include: [path.resolve(__dirname, '../src/renderer')],
                exclude: /node_modules/
            },
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, '../src/renderer')],
                loaders: ['react-hot-loader/webpack', 'babel-loader']
            }
        ]
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    devServer: {
        port: 2003,
        compress: true,
        noInfo: true,
        stats: 'errors-only',
        inline: true,
        hotOnly: true,
        contentBase: path.join(__dirname, '../dist'),
        historyApiFallback: {
            verbose: true,
            disableDotRule: false
        },
        before() {
            if (process.env.START_HOT) {
                console.log('Starting main process');
                spawn('npm', ['run', 'start-main-dev'], {
                    shell: true,
                    env: process.env,
                    stdio: 'inherit'
                })
                    .on('close', code => process.exit(code))
                    .on('error', spawnError => console.error(spawnError));
            }
        }
    }
});
