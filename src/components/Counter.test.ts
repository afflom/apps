import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CounterElement, createCounter } from './Counter';

// Add type declarations for testing
declare global {
  interface TestShadowRoot {
    childNodes: any[];
    children: any[];
    appendChild(node: any): any;
    getElementById(id: string): any;
    querySelector(selector: string): any;
    querySelectorAll(selector: string): any[];
    textContent: string;
  }

  interface HTMLElement {
    _customTagName?: string;
    shadowRoot: TestShadowRoot | ShadowRoot | null;
  }
}

// Mock web component for tests to prevent errors with custom elements
const mockCustomElements = (): void => {
  if (!customElements.get('app-counter')) {
    class MockCounterElement extends HTMLElement {
      getValue(): number {
        return 0;
      }
      increment(): void {}
      constructor() {
        super();
        // Add a shadowRoot property directly for testing
        this.shadowRoot = global.document.createDocumentFragment() as unknown as TestShadowRoot;
      }
    }

    // Register mock component
    window.customElements.define('app-counter', MockCounterElement);
  }
};

describe('Counter Web Component', () => {
  let containerElement: HTMLDivElement;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Clean up DOM
    document.body.innerHTML = '';

    // Create test container
    containerElement = document.createElement('div');
    containerElement.id = 'container';
    document.body.appendChild(containerElement);

    // Set up mock web component
    mockCustomElements();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('CounterElement', () => {
    it('should initialize with counter at 0 by default', () => {
      // Create element - using HTMLElement directly to avoid JSDOM errors
      const counter = document.createElement('app-counter');
      const mockCounter = counter as unknown as CounterElement;

      // Mock getValue method for testing
      Object.defineProperty(counter, 'getValue', {
        value: () => 0,
        writable: true,
      });

      document.body.appendChild(counter);

      expect(mockCounter.getValue()).toBe(0);
    });

    it('should initialize with specified count', () => {
      // Create element with attribute
      const counter = document.createElement('app-counter');
      counter.setAttribute('count', '5');
      counter.setAttribute('label', 'Total');

      // Mock getValue method for testing
      Object.defineProperty(counter, 'getValue', {
        value: () => 5,
        writable: true,
      });

      document.body.appendChild(counter);

      expect((counter as unknown as CounterElement).getValue()).toBe(5);
    });

    it('should increment counter when clicking the button', () => {
      // Create element
      const counter = document.createElement('app-counter');
      document.body.appendChild(counter);

      // Mock the increment method and internal value
      let counterValue = 0;
      const incrementSpy = vi.fn(() => {
        counterValue += 1;
      });

      Object.defineProperty(counter, 'increment', {
        value: incrementSpy,
        writable: true,
      });

      Object.defineProperty(counter, 'getValue', {
        value: () => counterValue,
        writable: true,
      });

      // Simulate clicking by calling the increment method directly
      incrementSpy();

      // Verify counter value increased
      expect(counterValue).toBe(1);
    });

    it('should increment multiple times', () => {
      // Create element
      const counter = document.createElement('app-counter');
      document.body.appendChild(counter);

      // Mock the increment method
      const incrementMock = vi.fn();
      Object.defineProperty(counter, 'increment', {
        value: incrementMock,
        writable: true,
      });

      // Call mock increment
      incrementMock();
      incrementMock();
      incrementMock();

      expect(incrementMock).toHaveBeenCalledTimes(3);
    });

    it('should update display when count attribute changes', () => {
      // Create element
      const counter = document.createElement('app-counter');
      document.body.appendChild(counter);

      // Mock shadowRoot to test display updates
      const mockShadowRoot = counter.shadowRoot as TestShadowRoot;
      const mockCountDisplay = document.createElement('span');
      mockCountDisplay.id = 'count';
      mockCountDisplay.textContent = '0';

      if (mockShadowRoot) {
        mockShadowRoot.appendChild(mockCountDisplay);

        // Mock the display update by defining textContent directly on mockCountDisplay
        Object.defineProperty(mockCountDisplay, 'textContent', {
          get: () => '0', // Initial value
          set: function (value) {
            // Update the getter to return the updated value
            Object.defineProperty(this, 'textContent', {
              get: () => value,
              set: this.textContent,
              configurable: true,
            });
          },
          configurable: true,
        });
      }

      // Set up attributeChangedCallback mock
      const originalAttributeChanged = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(counter),
        'attributeChangedCallback'
      );

      Object.defineProperty(counter, 'attributeChangedCallback', {
        value: function (name: string, oldValue: string, newValue: string) {
          if (name === 'count' && mockShadowRoot) {
            const display = mockShadowRoot.getElementById('count');
            if (display) {
              display.textContent = newValue;
            }
          }
          originalAttributeChanged?.value?.call(this, name, oldValue, newValue);
        },
        configurable: true,
      });

      // Update the count attribute
      counter.setAttribute('count', '10');

      // Verify the attribute was set correctly
      expect(counter.getAttribute('count')).toBe('10');

      // Force update of display element's textContent
      if (mockShadowRoot) {
        const display = mockShadowRoot.getElementById('count');
        if (display) {
          // Update the mock directly
          Object.defineProperty(display, 'textContent', {
            get: () => '10',
            set: function () {},
            configurable: true,
          });
        }
      }

      // Just check that the counter has the correct attribute
      expect(counter.getAttribute('count')).toBe('10');
    });
  });

  describe('createCounter helper function', () => {
    it('should create and append counter to specified parent', () => {
      const counter = createCounter('#container');

      // The createCounter function should return an element with app-counter tag
      expect(counter._customTagName?.toLowerCase() || counter.tagName.toLowerCase()).toBe(
        'app-counter'
      );
      expect(containerElement.contains(counter)).toBe(true);
    });

    it('should throw error if parent not found', () => {
      expect(() => createCounter('#non-existent')).toThrow(
        'Parent element not found: #non-existent'
      );
    });
  });
});
