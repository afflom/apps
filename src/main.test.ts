import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createApp } from './components/App';

// Mock dependencies - must be before importing the module
vi.mock('./services/pwa', () => ({
  pwaService: {
    register: vi.fn(() => Promise.resolve()),
  },
}));

// Mock Counter component for testing
vi.mock('./components/Counter', () => ({
  CounterElement: class MockCounter {
    // Implement basic Counter functionality for tests
    getValue(): number {
      return 0;
    }
    increment(): void {}
    setAttribute(): void {}
  },
  createCounter: vi.fn(),
}));

// Import after mocking
import { pwaService } from './services/pwa';

vi.mock('./components/App', () => ({
  createApp: vi.fn(),
}));

describe('Main application entry', () => {
  let originalAddEventListener: typeof document.addEventListener;
  let eventListeners: Record<string, EventListenerOrEventListenerObject[]>;

  beforeEach(() => {
    vi.resetAllMocks();

    // Store original addEventListener
    originalAddEventListener = document.addEventListener;

    // Mock addEventListener
    eventListeners = {};
    document.addEventListener = vi.fn((event, listener) => {
      if (!eventListeners[event]) {
        eventListeners[event] = [];
      }
      eventListeners[event].push(listener as EventListenerOrEventListenerObject);
    });
  });

  afterEach(() => {
    // Restore original
    document.addEventListener = originalAddEventListener;

    // Reset document
    document.body.innerHTML = '';
  });

  it('should register PWA service', async () => {
    // Import the module to trigger the code
    await import('./main');

    expect(pwaService.register).toHaveBeenCalled();
  });

  it('should handle PWA registration errors gracefully', async () => {
    // Clear module cache to re-import
    vi.resetModules();

    // Mock console.warn
    const warnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Make registration fail
    (pwaService.register as any).mockRejectedValueOnce(new Error('Test error'));

    // Import the module to trigger the code
    await import('./main');

    // Wait for promise rejection to be processed
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Should have logged warning
    expect(warnMock).toHaveBeenCalledWith('PWA initialization failed:', expect.any(Error));

    // Clean up
    warnMock.mockRestore();
  });

  it('should initialize app on DOMContentLoaded', async () => {
    // Clear module cache to re-import
    vi.resetModules();

    // Spy on document.addEventListener
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

    // Import the module to trigger the code
    await import('./main');

    // Verify event listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

    // Get the listener and call it
    const listener = addEventListenerSpy.mock.calls[0][1] as EventListener;
    listener({} as Event);

    // App should be created
    expect(createApp).toHaveBeenCalledWith('#app');

    // Clean up
    addEventListenerSpy.mockRestore();
  });
});
