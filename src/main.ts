import './style.css';
import { pwaService } from './services/pwa';
import { createApp } from './components/App';

// Initialize the PWA
pwaService.register().catch((error) => {
  console.warn('PWA initialization failed:', error);
});

// Create and initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  createApp('#app');
});
