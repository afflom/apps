import { Workbox } from 'workbox-window';
import { swConfig } from '../utils/config';
import * as logger from '../utils/logger';

// Define custom error event type
interface WorkboxErrorEvent extends Event {
  error?: Error;
}

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
    // Fail directly if service worker is not supported
    if (!('serviceWorker' in navigator)) {
      return Promise.reject(new Error('Service worker not supported'));
    }

    try {
      // Create the Workbox instance
      this.wb = new Workbox(swConfig.url);

      // Set up event listeners
      this.setupEventListeners();

      // Register and return the promise without additional wrapping
      // This allows errors to properly propagate up
      return this.wb.register().then(() => {
        logger.info('Service worker registered successfully');
      });
    } catch (error) {
      // Only log initialization errors, but still reject to allow caller to handle them
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error('Error during service worker initialization: ' + errorMsg);
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Set up event listeners for the service worker
   */
  private setupEventListeners(): void {
    if (!this.wb) return;

    try {
      // Handle service worker installation
      this.wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          logger.info('Service worker updated - showing update prompt');
          this.showUpdatePrompt();
        } else {
          logger.info('Service worker installed for the first time');
        }
      });

      // Handle controller change (when the service worker takes control)
      this.wb.addEventListener('controlling', () => {
        logger.info('Service worker is now controlling the page');
      });

      // Handle service worker activation
      this.wb.addEventListener('activated', (event) => {
        if (event.isUpdate) {
          logger.info('Service worker activated after update');
        } else {
          logger.info('Service worker activated for the first time');
        }
      });

      // Handle waiting service worker (update waiting to be activated)
      this.wb.addEventListener('waiting', () => {
        logger.info('New service worker waiting to be activated');
        this.showUpdatePrompt();
      });

      // Handle registration errors
      // Cast to 'any' only for the event name string, as 'error' is not in the official type definitions
      this.wb.addEventListener('error' as any, (event: WorkboxErrorEvent) => {
        const errorMsg = event.error ? event.error.message : String(event);
        logger.error('Service worker error: ' + errorMsg);
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error('Error setting up service worker event listeners: ' + errorMsg);
    }
  }

  /**
   * Show update prompt to user
   */
  private showUpdatePrompt(): void {
    if (confirm('New app update is available! Click OK to refresh.')) {
      // If user accepts, refresh the page to activate the new service worker
      window.location.reload();
    }
  }

  /**
   * Check if PWA is installed
   * @returns boolean indicating if app is installed
   */
  isInstalled(): boolean {
    try {
      // Interface for window with optional standalone property
      interface NavigatorWithStandalone extends Navigator {
        standalone?: boolean;
      }

      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as NavigatorWithStandalone).standalone === true
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error('Error checking if PWA is installed: ' + errorMsg);
      return false;
    }
  }

  /**
   * Check service worker registration status
   * @returns Promise resolving to boolean indicating if service worker is registered
   */
  isRegistered(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return Promise.resolve(false);
    }

    return navigator.serviceWorker
      .getRegistration()
      .then((registration) => !!registration)
      .catch((error) => {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error('Error checking service worker registration: ' + errorMsg);
        return false;
      });
  }
}

export const pwaService = new PWAService();
