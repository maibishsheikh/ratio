import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/courses/grade-6-math/ratios-rates-proportions/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':   ['react','react-dom'],
          'vendor-motion':  ['framer-motion'],
          'vendor-zustand': ['zustand'],
          'vendor-lucide':  ['lucide-react'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react','react-dom','framer-motion','zustand','lucide-react'],
  },
});
