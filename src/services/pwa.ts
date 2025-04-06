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

      this.wb = new Workbox('/sw.js');
      
      this.wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          this.showUpdatePrompt();
        }
      });
      
      this.wb.register()
        .then(() => resolve())
        .catch(error => reject(error));
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
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true;
  }
}

export const pwaService = new PWAService();
