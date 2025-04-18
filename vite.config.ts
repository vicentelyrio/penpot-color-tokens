import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import livePreview from 'vite-live-preview'

export default defineConfig({
  plugins: [
    preact(),
    livePreview({ reload: true }),
  ],
  build: {
    rollupOptions: {
      input: {
        plugin: 'src/plugin.ts',
        index: './index.html',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  preview: {
    port: 4400,
  },
  server: {
    port: 4400,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  }
})
