import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact() as any],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/setup.ts']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@assets': resolve(__dirname, './src/assets'),
      '@consts': resolve(__dirname, './src/consts'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@plugin': resolve(__dirname, './src/plugin'),
      '@utils': resolve(__dirname, './src/utils'),
      '@penpot/plugin-styles': resolve(__dirname, './src/test/mocks/pluginStyles.ts'),
      '@penpot/plugin-types': resolve(__dirname, './src/test/mocks/pluginTypes.ts')
    }
  }
})
