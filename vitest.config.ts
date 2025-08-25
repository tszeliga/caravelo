import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  test: {
    environment: 'jsdom',
    globals: true,
    typecheck: {
      tsconfig: './tsconfig.test.json'
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@quota-management': fileURLToPath(
        new URL('./src/features/quota-management', import.meta.url)
      ),
      '@subscriber-management': fileURLToPath(
        new URL('./src/features/subscriber-management', import.meta.url)
      ),
      '@back-office': fileURLToPath(
        new URL('./src/features/back-office', import.meta.url)
      )
    }
  }
})
