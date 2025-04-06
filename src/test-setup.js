/**
 * Test setup file for Vitest
 * 
 * This file provides polyfills and setup for testing web components with JSDOM
 */

// Polyfill for Custom Elements - needed for JSDOM tests
if (!window.customElements) {
  window.customElements = {
    define: () => {},
    get: () => undefined,
    whenDefined: () => Promise.resolve(),
  };
}

// Polyfill for Shadow DOM
class MockShadowRoot {
  constructor() {
    this.childNodes = [];
    this.children = [];
  }

  appendChild(node) {
    this.childNodes.push(node);
    if (node.nodeType === 1) { // ELEMENT_NODE
      this.children.push(node);
    }
    return node;
  }

  querySelector(selector) {
    // Basic implementation of querySelector to find nodes in shadow DOM
    for (const child of this.children) {
      if (child.matches && child.matches(selector)) {
        return child;
      }
      
      // Recursively check children
      if (child.children && child.children.length) {
        for (const grandchild of child.children) {
          if (grandchild.matches && grandchild.matches(selector)) {
            return grandchild;
          }
        }
      }
    }
    return null;
  }

  querySelectorAll(selector) {
    const results = [];
    // Basic implementation for tests
    for (const child of this.children) {
      if (child.matches && child.matches(selector)) {
        results.push(child);
      }
      
      // Recursively check children
      if (child.children && child.children.length) {
        for (const grandchild of child.children) {
          if (grandchild.matches && grandchild.matches(selector)) {
            results.push(grandchild);
          }
        }
      }
    }
    return results;
  }

  // Add any other methods needed by tests
  get textContent() {
    return this.childNodes.map(node => {
      if (typeof node.textContent === 'string') {
        return node.textContent;
      } else if (node.nodeValue) {
        return node.nodeValue;
      }
      return '';
    }).join('');
  }
}

// Add attachShadow method to Element prototype if not present
if (!Element.prototype.attachShadow) {
  Element.prototype.attachShadow = function() {
    this.shadowRoot = new MockShadowRoot();
    return this.shadowRoot;
  };
}

// Make sure document.createElement can handle custom elements
const originalCreateElement = document.createElement;
document.createElement = function(tagName, options) {
  if (tagName.includes('-')) {
    // It's a custom element
    const element = originalCreateElement.call(document, 'div', options);
    element.tagName = tagName.toUpperCase();
    return element;
  }
  return originalCreateElement.call(document, tagName, options);
};

// Set up a global registry to keep track of defined web components
window.__WEB_COMPONENTS_REGISTRY = new Map();

// For tests, register custom elements globally
global.registerCustomElement = function(name, elementClass) {
  window.__WEB_COMPONENTS_REGISTRY.set(name, elementClass);
  customElements.define(name, elementClass);
};

// Export a helper to create instances of custom elements for testing
global.createCustomElement = function(name, props = {}) {
  const element = document.createElement(name);
  Object.entries(props).forEach(([key, value]) => {
    element[key] = value;
  });
  return element;
};

// Add mockWebComponent helper for tests
global.mockWebComponent = function(name) {
  class MockComponent extends HTMLElement {
    constructor() {
      super();
      this.shadowRoot = new MockShadowRoot();
      this.attributes = new Map();
    }
    
    getAttribute(name) {
      return this.attributes.get(name) || null;
    }
    
    setAttribute(name, value) {
      this.attributes.set(name, value);
      if (this.attributeChangedCallback) {
        this.attributeChangedCallback(name, this.getAttribute(name), value);
      }
    }
    
    connectedCallback() {}
    disconnectedCallback() {}
    attributeChangedCallback() {}
  }
  
  customElements.define(name, MockComponent);
  return MockComponent;
};

// Vitest-specific setup if needed
// (This might be expanded based on your specific test needs)