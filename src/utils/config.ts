/**
 * Application configuration
 *
 * This module provides centralized configuration values for the application.
 * It uses environment variables and package.json version when available.
 */

// Get package version from environment if available
const packageVersion = process.env.npm_package_version || '1.0.0';

/**
 * Service worker configuration
 */
export const swConfig = {
  // Service worker URL based on environment
  url: process.env.NODE_ENV === 'production' ? '/sw.js' : './sw.js',
  // Default scope for the service worker
  scope: '/',
  // Cache name with version
  cacheName: `ts-pwa-cache-v${packageVersion}`,
  // Resources to pre-cache
  precacheUrls: [
    '/',
    '/index.html',
    '/favicon.ico',
    '/robots.txt',
    '/apple-touch-icon.png',
    '/pwa-192x192.png',
    '/pwa-512x512.png',
  ],
};

/**
 * Application UI configuration
 */
export const appConfig = {
  // Root selector for the main application
  rootSelector: '#app',
  // Container ID for error display
  errorContainerId: 'app-error-container',
  // Default application title
  defaultTitle: 'TypeScript PWA Template',
};
