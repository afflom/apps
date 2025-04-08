import './style.css';
import { pwaService } from './services/pwa';
import './components/Counter';
import { createApp } from './components/App';

// Initialize the PWA
pwaService.register().catch((error) => {
  if (error instanceof Error) {
    // Common errors during development - don't show these in console when in development
    if (
      error.message.includes('Service worker has incorrect MIME type') ||
      error.message.includes('Service worker file not found')
    ) {
      console.info(
        'PWA service worker not available during development. This is expected and will work in production.'
      );
    } else {
      console.warn('PWA initialization failed:', error);
    }
  } else {
    console.warn('PWA initialization failed with unknown error');
  }
});

// Create and initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  createApp('#app');
});
