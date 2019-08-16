const path = require('path');

const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js'
    },
    node: {
        __dirname: false,
        __filename: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: [
                    'babel-loader',
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            moduleResolution: 'node',
                            module: 'esnext'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
            shared: path.resolve(__dirname, '../src/shared')
        }
    },
    plugins: [new CheckerPlugin()]
};
