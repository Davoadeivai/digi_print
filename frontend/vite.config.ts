import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/static/' : '/',
  plugins: [react()],

  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1600, // برای فایل‌های بزرگ React

    minify: 'terser', // تغییر minifier از esbuild به terser
    terserOptions: {
      compress: {
        drop_console: false, // برای دیباگ نگه دار
      },
    },

    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',

        hoistTransitiveImports: false,
        manualChunks: undefined, 
        inlineDynamicImports: false,
      },

      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
  },

  esbuild: {
    target: 'es2020', // target بالاتر برای React
  },
})
