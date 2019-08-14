const path = require('path');

module.exports = {
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js'
    },
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.js', '.json', '.ts'],
        alias: {
            shared: path.resolve(__dirname, '../src/shared')
        }
    },
    plugins: []
};
