import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login/index.html'),
        signIn: resolve(__dirname, 'signin/index.html'),
      },
    },
    outDir: '../public',
    emptyOutDir: true,
    assetsDir: 'static',
  },
});
