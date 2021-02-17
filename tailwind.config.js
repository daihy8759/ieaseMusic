module.exports = {
    purge: ['./src/**/*.{html,js,ts,jsx,tsx}'],
    darkMode: false,
    theme: {
        extend: {
            textIndent: (theme) => theme('spacing'),
            animation: {
                'spin-slow': 'spin 72s linear infinite',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('tailwindcss-text-indent')()],
};
