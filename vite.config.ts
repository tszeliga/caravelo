import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vuetify from 'vite-plugin-vuetify'

const META_URL = import.meta.url

export default defineConfig({
  plugins: [vue(), vuetify()],
  base: '/caravelo/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', META_URL)),
      '@app': fileURLToPath(new URL('./src/app', META_URL)),
      '@shared': fileURLToPath(new URL('./src/shared', META_URL)),
      '@features': fileURLToPath(new URL('./src/features', META_URL)),
      '@quota': fileURLToPath(
        new URL('./src/features/quota-management', META_URL)
      ),
      '@subscribers': fileURLToPath(
        new URL('./src/features/subscriber-management', META_URL)
      ),
      '@back-office': fileURLToPath(
        new URL('./src/features/back-office', META_URL)
      )
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
