import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

const META_URL = import.meta.url

export default defineConfig({
  plugins: [
    vue(),
    vuetify()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', META_URL)),
      '@assets': fileURLToPath(new URL('./src/assets', META_URL)),
      '@components': fileURLToPath(new URL('./src/components', META_URL)),
      '@composables': fileURLToPath(new URL('./src/composables', META_URL)),
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  },
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000,
    open: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  }
})