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
        extensions: ['.js', '.json']
    },
    plugins: []
};
