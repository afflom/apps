import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PWAService } from './pwa';

describe('PWAService', () => {
  let pwaService: PWAService;
  let mockWorkbox: any;
  let originalNavigator: any;
  let mockConfirm: any;
  let mockLocation: any;

  beforeEach(() => {
    // Store original navigator and location
    originalNavigator = global.navigator;
    mockLocation = { reload: vi.fn() };

    // Mock confirm dialog
    mockConfirm = vi.fn().mockReturnValue(true);
    global.confirm = mockConfirm;
    global.window.location = mockLocation as any;

    // Mock Workbox
    mockWorkbox = {
      addEventListener: vi.fn(),
      register: vi.fn().mockResolvedValue(undefined),
    };

    // Create service instance
    pwaService = new PWAService();

    // Force serviceWorker to be defined
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {},
      configurable: true,
    });

    // Mock the Workbox constructor
    vi.mock('workbox-window', () => ({
      Workbox: vi.fn().mockImplementation(() => mockWorkbox),
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
    global.navigator = originalNavigator;
    vi.restoreAllMocks();
  });

  describe('register', () => {
    it('should register the service worker', async () => {
      await pwaService.register();
      expect(mockWorkbox.register).toHaveBeenCalled();
    });

    it('should reject if service worker is not supported', async () => {
      // Remove serviceWorker from navigator
      delete (global.navigator as any).serviceWorker;

      await expect(pwaService.register()).rejects.toThrow('Service worker not supported');
    });

    it('should set up update listener', async () => {
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
