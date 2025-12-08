import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
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

    minify: 'terser', // تغییر minifier از esbuild به terser (این باگ xc رو حل می‌کنه)
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

        // تنظیمات ضد باگ initialization
        hoistTransitiveImports: false,
        manualChunks: undefined, // chunking رو غیرفعال می‌کنه
        inlineDynamicImports: false,
        experimentalMinifyLiterals: false, // minify ساده‌تر
        sanitizeForIife: true, // برای IIFE mode (production) ایمن‌تر
      },

      // غیرفعال کردن tree-shaking سخت‌گیرانه (بعضی React کامپوننت‌ها رو خراب می‌کنه)
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
  },

  // غیرفعال کردن esbuild برای build (فقط dev استفاده کن)
  esbuild: {
    target: 'es2020', // target بالاتر برای React
  },
})