const esbuild = require('rollup-plugin-esbuild');

module.exports = () => {
    return esbuild({
        include: /\.[jt]sx?$/,
        exclude: /node_modules/,
        sourceMap: false,
        minify: process.env.NODE_ENV === 'production',
        target: 'es2017',
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        define: {
            __VERSION__: '"x.y.z"',
        },
    });
};
