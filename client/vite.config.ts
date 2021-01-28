import reactRefresh from '@vitejs/plugin-react-refresh';
import viteESLint from '@ehutch79/vite-eslint';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    reactRefresh(),
    viteESLint({
      include: ['./**/*.ts', './**/*.tsx'],
      exclude: ['node_modules'],
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login/index.html'),
        signIn: resolve(__dirname, 'signin/index.html'),
        profile: resolve(__dirname, 'profile/index.html'),
      },
    },
    outDir: '../public',
    emptyOutDir: true,
    assetsDir: 'static',
  },
});
