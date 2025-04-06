import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    browser: {
      enabled: false // Run in node environment for simplicity during setup
    },
    deps: {
      optimizer: {
        web: {
          include: ['@uor-foundation/math-js'] // Include dependencies for easier mocking
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