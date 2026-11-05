import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/.vs/**', '**/node_modules/**', '**/dist/**'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
  },
})
