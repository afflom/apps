import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PWAService } from './pwa';

// Create a mock for workbox-window
const mockWorkbox = {
  addEventListener: vi.fn(),
  register: vi.fn(() => Promise.resolve()),
};

// Mock workbox-window module before importing PWAService
vi.mock('workbox-window', () => ({
  Workbox: function () {
    return mockWorkbox;
  },
}));

describe('PWAService', () => {
  let pwaService: PWAService;
  let originalNavigator: any;
  let mockConfirm: any;
  let mockLocation: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Store original navigator and location
    originalNavigator = global.navigator;
    mockLocation = { reload: vi.fn() };

    // Mock confirm dialog
    mockConfirm = vi.fn().mockReturnValue(true);
    global.confirm = mockConfirm;
    global.window.location = mockLocation as any;

    // Create service instance
    pwaService = new PWAService();

    // Force serviceWorker to be defined
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {},
      configurable: true,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    global.navigator = originalNavigator;
    vi.restoreAllMocks();
  });

  describe('register', () => {
    beforeEach(() => {
      // Mock fetch for service worker validation
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('application/javascript'),
        },
      });
    });

    it('should register the service worker when everything is correct', async () => {
      await pwaService.register();
      expect(global.fetch).toHaveBeenCalled();
      expect(mockWorkbox.register).toHaveBeenCalled();
    });

    it('should reject if service worker is not supported', async () => {
      // Remove serviceWorker from navigator
      delete (global.navigator as any).serviceWorker;

      await expect(pwaService.register()).rejects.toThrow('Service worker not supported');
    });

    it('should reject if service worker file is not found', async () => {
      // Mock fetch to return not found
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        headers: {
          get: vi.fn(),
        },
      });

      await expect(pwaService.register()).rejects.toThrow('Service worker file not found');
    });

    it('should reject if service worker has incorrect MIME type', async () => {
      // Mock fetch to return incorrect MIME type
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('text/html'),
        },
      });

      await expect(pwaService.register()).rejects.toThrow('Service worker has incorrect MIME type');
    });

    it('should set up update listener when service worker is valid', async () => {
      await pwaService.register();
      expect(mockWorkbox.addEventListener).toHaveBeenCalledWith('installed', expect.any(Function));
    });

    it('should handle update event and reload on confirmation', async () => {
      await pwaService.register();

      // Get the event handler that was registered
      const handler = mockWorkbox.addEventListener.mock.calls[0][1];

      // Call the handler with an update event
      handler({ isUpdate: true });

      expect(mockConfirm).toHaveBeenCalledWith('New app update is available! Click OK to refresh.');
      expect(mockLocation.reload).toHaveBeenCalled();
    });

    it('should not reload if update is dismissed', async () => {
      // Set confirm to return false
      mockConfirm.mockReturnValueOnce(false);

      await pwaService.register();

      // Get and call the event handler
      const handler = mockWorkbox.addEventListener.mock.calls[0][1];
      handler({ isUpdate: true });

      expect(mockConfirm).toHaveBeenCalled();
      expect(mockLocation.reload).not.toHaveBeenCalled();
    });
  });

  describe('isInstalled', () => {
    it('should detect standalone display mode', () => {
      // Mock matchMedia to return standalone true
      global.window.matchMedia = vi.fn().mockReturnValue({ matches: true });

      expect(pwaService.isInstalled()).toBe(true);
    });

    it('should detect iOS standalone mode', () => {
      // Mock matchMedia to return non-standalone
      global.window.matchMedia = vi.fn().mockReturnValue({ matches: false });

      // Mock iOS standalone property
      (global.navigator as any).standalone = true;

      expect(pwaService.isInstalled()).toBe(true);
    });

    it('should return false when not installed', () => {
      // Mock matchMedia to return non-standalone
      global.window.matchMedia = vi.fn().mockReturnValue({ matches: false });

      // Ensure iOS standalone is false
      (global.navigator as any).standalone = false;

      expect(pwaService.isInstalled()).toBe(false);
    });
  });
});
