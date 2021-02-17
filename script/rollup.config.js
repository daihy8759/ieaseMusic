const path = require('path');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json');
const pluginEsbuild = require('./rollup.esbuild.plugin');

const external = [
    'crypto',
    'assert',
    'fs',
    'util',
    'os',
    'events',
    'child_process',
    'http',
    'https',
    'path',
    'electron',
];

module.exports = (env = 'production') => {
    return [
        {
            input: path.join(__dirname, '../src/main/index.ts'),
            output: {
                file: path.join(__dirname, '../dist/main/build.js'),
                format: 'cjs',
                name: 'ElectronMainBundle',
                sourcemap: env.NODE_ENV !== 'production',
            },
            plugins: [
                nodeResolve({ jsnext: true, preferBuiltins: true, browser: true }),
                commonjs(),
                json(),
                pluginEsbuild(),
                alias({
                    entries: [{ find: '@main', replacement: path.join(__dirname, '../src/main') }],
                }),
            ],
            external,
        },
        {
            input: path.join(__dirname, '../src/preload/index.ts'),
            output: {
                file: path.join(__dirname, '../dist/preload/index.preload.js'),
                format: 'cjs',
                name: 'preload',
                sourcemap: false,
            },
            plugins: [
                nodeResolve({
                    browser: false,
                }),
                commonjs(),
                json(),
                pluginEsbuild(),
            ],
            external,
        },
    ];
};
