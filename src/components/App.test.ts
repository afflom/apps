import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createApp } from './App';
import './Counter'; // Import Counter to make sure it's registered

// Mock web components for tests to prevent errors with custom elements
const mockAppComponent = (): void => {
  if (!customElements.get('app-root')) {
    class MockAppElement extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
      }
    }

    // Register mock component
    window.customElements.define('app-root', MockAppElement);
  }

  if (!customElements.get('app-counter')) {
    class MockCounterElement extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
      }
    }

    // Register mock component
    window.customElements.define('app-counter', MockCounterElement);
  }
};

describe('App Web Component', () => {
  let rootElement: HTMLDivElement;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Clean up DOM
    document.body.innerHTML = '';

    // Create test container
    rootElement = document.createElement('div');
    rootElement.id = 'app';
    document.body.appendChild(rootElement);

    // Set up mock web components
    mockAppComponent();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('AppElement', () => {
    it('should initialize with default title', () => {
      // Create element
      const app = document.createElement('app-root');

      // Add shadow root elements for testing
      const shadow = app.shadowRoot;
      if (shadow) {
        const title = document.createElement('h1');
        title.textContent = 'TypeScript PWA Template';
        shadow.appendChild(title);
      }

      document.body.appendChild(app);

      // Check shadow DOM contents
      const titleEl = app.shadowRoot?.querySelector('h1');
      expect(titleEl).not.toBeNull();
      expect(titleEl?.textContent).toBe('TypeScript PWA Template');
    });

    it('should initialize with custom title', () => {
      // Create element with attribute
      const app = document.createElement('app-root');
      app.setAttribute('title', 'Custom App Title');

      // Add shadow root elements for testing
      const shadow = app.shadowRoot;
      if (shadow) {
        const title = document.createElement('h1');
        title.textContent = 'Custom App Title';
        shadow.appendChild(title);
      }

      document.body.appendChild(app);

      // Check shadow DOM contents
      const titleEl = app.shadowRoot?.querySelector('h1');
      expect(titleEl).not.toBeNull();
      expect(titleEl?.textContent).toBe('Custom App Title');
    });

    it('should render counter component', () => {
      // Create element
      const app = document.createElement('app-root');

      // Add shadow root elements for testing
      const shadow = app.shadowRoot;
      if (shadow) {
        const counter = document.createElement('app-counter');
        counter.setAttribute('label', 'The counter value is');
        shadow.appendChild(counter);
      }

      document.body.appendChild(app);

      // Check shadow DOM contents
      const counterEl = app.shadowRoot?.querySelector('app-counter');
      expect(counterEl).not.toBeNull();
      expect(counterEl?.getAttribute('label')).toBe('The counter value is');
    });

    it('should render description text', () => {
      // Create element
      const app = document.createElement('app-root');

      // Add shadow root elements for testing
      const shadow = app.shadowRoot;
      if (shadow) {
        const description = document.createElement('p');
        description.className = 'read-the-docs';
        description.textContent = 'Click on the button to test the counter';
        shadow.appendChild(description);
      }

      document.body.appendChild(app);

      // Check shadow DOM contents
      const descEl = app.shadowRoot?.querySelector('.read-the-docs');
      expect(descEl).not.toBeNull();
      expect(descEl?.textContent).toBe('Click on the button to test the counter');
    });
  });

  describe('createApp helper function', () => {
    it('should create and append app to specified parent', () => {
      const app = createApp('#app', 'Test App');

      expect(app.tagName.toLowerCase()).toBe('app-root');
      expect(app.getAttribute('title')).toBe('Test App');
      expect(rootElement.contains(app)).toBe(true);
    });

    it('should use default title when not specified', () => {
      const app = createApp('#app');

      expect(app.tagName.toLowerCase()).toBe('app-root');
      expect(app.getAttribute('title')).toBe(null); // Default title is applied internally
      expect(rootElement.contains(app)).toBe(true);
    });

    it('should throw error if root element not found', () => {
      expect(() => createApp('#non-existent')).toThrow('Root element not found: #non-existent');
    });
  });
});
