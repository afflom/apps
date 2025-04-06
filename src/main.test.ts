import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pwaService } from './services/pwa';
import { createApp } from './components/App';

// Mock dependencies
vi.mock('./services/pwa', () => ({
  pwaService: {
    register: vi.fn().mockResolvedValue(undefined)
  }
}));

vi.mock('./components/App', () => ({
  createApp: vi.fn()
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
    // Mock console.warn
    const originalWarn = console.warn;
    console.warn = vi.fn();
    
    // Make registration fail
    (pwaService.register as any).mockRejectedValueOnce(new Error('Test error'));
    
    // Import the module to trigger the code
    await import('./main');
    
    // Should have logged warning
    expect(console.warn).toHaveBeenCalledWith(
      'PWA initialization failed:',
      expect.any(Error)
    );
    
    // Restore console.warn
    console.warn = originalWarn;
  });
  
  it('should initialize app on DOMContentLoaded', async () => {
    // Import the module to trigger the code
    await import('./main');
    
    // Verify event listener was added
    expect(document.addEventListener).toHaveBeenCalledWith(
      'DOMContentLoaded',
      expect.any(Function)
    );
    
    // Get the listener and call it
    const listener = eventListeners['DOMContentLoaded'][0];
    (listener as EventListener)({} as Event);
    
    // App should be created
    expect(createApp).toHaveBeenCalledWith('#app');
  });
});