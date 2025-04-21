import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import preact from '@preact/preset-vite'
import livePreview from 'vite-live-preview'

const pathResolver = (path: string) => (
  fileURLToPath(new URL(`./src/${path}`, import.meta.url))
)

export default defineConfig({
  plugins: [
    preact(),
    livePreview({ reload: true }),
  ],
  resolve: {
    alias: [
      { find: '@components', replacement: pathResolver('components') },
      { find: '@hooks', replacement: pathResolver('hooks') },
      { find: '@utils', replacement: pathResolver('utils') },
    ],
  },
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
