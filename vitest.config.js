import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Running in JSDOM for simplicity, with custom element support
    setupFiles: ['./src/test-setup.js'],
    deps: {
      optimizer: {
        web: {
          include: ['@uor-foundation/math-js']
        }
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
});