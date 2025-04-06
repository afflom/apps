import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { App, createApp } from './App';
import { createCounter } from './Counter';

// Mock Counter component
vi.mock('./Counter', () => ({
  createCounter: vi.fn(() => ({
    increment: vi.fn(),
    getValue: vi.fn(() => 0)
  }))
}));

describe('App Component', () => {
  let appContainer: HTMLDivElement;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Clean up DOM
    document.body.innerHTML = '';
    
    // Create test container
    appContainer = document.createElement('div');
    appContainer.id = 'app';
    document.body.appendChild(appContainer);
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  describe('App class', () => {
    it('should initialize with container selector', () => {
      const app = new App('#app');
      expect(() => app.init()).not.toThrow();
      expect(appContainer.innerHTML).not.toBe('');
    });
    
    it('should initialize with container element', () => {
      const app = new App(appContainer);
      expect(() => app.init()).not.toThrow();
      expect(appContainer.innerHTML).not.toBe('');
    });
    
    it('should throw if container not found', () => {
      expect(() => new App('#non-existent')).toThrow('Container not found: #non-existent');
    });
    
    it('should render expected content', () => {
      const app = new App(appContainer);
      app.init();
      
      // Check elements
      expect(appContainer.querySelector('h1')).not.toBeNull();
      expect(appContainer.querySelector('h1')?.textContent).toBe('TypeScript PWA Template');
      expect(appContainer.querySelector('#counter')).not.toBeNull();
      expect(appContainer.querySelector('.card')).not.toBeNull();
      expect(appContainer.querySelector('.read-the-docs')).not.toBeNull();
    });
    
    it('should initialize counter component', () => {
      const app = new App(appContainer);
      app.init();
      
      expect(createCounter).toHaveBeenCalledWith('#counter');
    });
  });
  
  describe('createApp factory', () => {
    it('should create app with default container', () => {
      const app = createApp();
      expect(createCounter).toHaveBeenCalled();
      expect(appContainer.innerHTML).not.toBe('');
    });
    
    it('should create app with specified container', () => {
      const app = createApp('#app');
      expect(createCounter).toHaveBeenCalled();
      expect(appContainer.innerHTML).not.toBe('');
    });
  });
});
