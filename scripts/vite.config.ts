import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    // خروجی build فرانت‌اند داخل static/frontend در پروژه Django
    outDir: path.resolve(__dirname, 'src/django_backend/static/frontend'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // نام‌های ثابت برای فایل‌های اصلی تا در قالب Django راحت import شوند
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/chunk-[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
