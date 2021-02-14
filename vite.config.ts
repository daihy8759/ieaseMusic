import reactRefresh from '@vitejs/plugin-react-refresh';
import dotenv from 'dotenv-flow';
import { join } from 'path';
import { defineConfig } from 'vite';

dotenv.config();
const root = join(__dirname, 'src/renderer');

export default defineConfig({
    root,
    base: './',
    resolve: {
        alias: { '/@': root },
    },
    build: {
        outDir: join('../../dist/renderer'),
        emptyOutDir: true,
    },
    server: {
        port: +process.env.PORT,
    },
    plugins: [reactRefresh()],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
});
