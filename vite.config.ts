import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3002,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
    watch: {
      usePolling: true
    },
    hmr: {
      port: 3002
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}); 