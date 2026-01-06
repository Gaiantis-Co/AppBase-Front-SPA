import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import nightwatchPlugin from 'vite-plugin-nightwatch'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import type { Plugin } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    vue(),
    vueDevTools(),
    nightwatchPlugin(),
    tailwindcss(),
    visualizer({
      open: false,
      filename: 'bundle-analysis.html',
    }) as Plugin,
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-ui': ['vue', 'vue-router', 'pinia', 'vue-toastification'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
