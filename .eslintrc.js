module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        'react/prop-types': 0,
        '@typescript-eslint/no-use-before-define': 0,
        'react/display-name': 0,
    },
};
