import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Das Manifest braucht scripts/prerender.mjs, um je Route den Baustein
  // der Seite per modulepreload anzukuendigen.
  build: { manifest: true },
  server: {
    port: 5180,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
