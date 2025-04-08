import { Workbox } from 'workbox-window';

/**
 * Service worker registration and update handling
 */
export class PWAService {
  private wb: Workbox | null = null;

  /**
   * Register service worker if supported
   * @returns Promise that resolves when registration is complete or fails if not supported
   */
  register(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('serviceWorker' in navigator)) {
        reject(new Error('Service worker not supported'));
        return;
      }

      // Use a simple path to the service worker
      const swURL = './sw.js';

      // First check if the service worker file exists and has the correct MIME type
      fetch(swURL, { method: 'HEAD' })
        .then((response) => {
          const contentType = response.headers.get('content-type');

          if (!response.ok) {
            throw new Error(`Service worker file not found at ${swURL}`);
          }

          if (contentType && !contentType.includes('javascript')) {
            throw new Error(`Service worker has incorrect MIME type: ${contentType}`);
          }

          // If we get here, the service worker file exists and has the correct MIME type
          this.wb = new Workbox(swURL);

          this.wb.addEventListener('installed', (event) => {
            if (event.isUpdate) {
              this.showUpdatePrompt();
            }
          });

          return this.wb.register();
        })
        .then(() => {
          console.info('Service worker registered successfully');
          resolve();
        })
        .catch((error) => {
          console.error('Service worker registration failed:', error);
          reject(error instanceof Error ? error : new Error(String(error)));
        });
    });
  }

  /**
   * Show update prompt to user
   */
  private showUpdatePrompt(): void {
    if (confirm('New app update is available! Click OK to refresh.')) {
      window.location.reload();
    }
  }

  /**
   * Check if PWA is installed
   * @returns boolean indicating if app is installed
   */
  isInstalled(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  }
}

export const pwaService = new PWAService();
