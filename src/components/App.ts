// Import the Counter web component
import './Counter';

/**
 * App Web Component - Main application container
 */
export class AppElement extends HTMLElement {
  private _title: string; // Use _ to avoid conflicts with HTMLElement properties

  // Observed attributes
  static get observedAttributes(): string[] {
    return ['title'];
  }

  constructor() {
    super();

    // Create shadow DOM for encapsulation
    const shadow = this.attachShadow({ mode: 'open' });

    // Get the title from attribute or use default
    this._title = this.getAttribute('title') || 'TypeScript PWA Template';

    // Create styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.5;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.87);
        background-color: #242424;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
      
      h1 {
        font-size: 2.5em;
        line-height: 1.1;
        text-align: center;
        margin-bottom: 1rem;
        color: #646cff;
      }
      
      h2 {
        font-size: 1.8em;
        color: #8f94fb;
        margin-top: 2rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid #444;
        padding-bottom: 0.5rem;
      }
      
      .intro {
        margin: 2rem 0;
        text-align: center;
        font-size: 1.2em;
      }
      
      .features-container {
        margin: 2rem 0;
      }
      
      .features-list {
        text-align: left;
        margin-left: 1rem;
        line-height: 1.8;
      }
      
      .features-list li {
        margin-bottom: 0.5rem;
        position: relative;
        padding-left: 1.5rem;
      }
      
      .features-list li::before {
        content: "✓";
        color: #4CAF50;
        position: absolute;
        left: 0;
        font-weight: bold;
      }
      
      .demo-section {
        background-color: #2a2a2a;
        border-radius: 8px;
        padding: 1.5rem;
        margin: 2rem 0;
        text-align: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      
      .capabilities-section {
        margin: 2rem 0;
      }
      
      .capabilities-section ol {
        text-align: left;
        margin-left: 1rem;
        line-height: 1.8;
      }
      
      .capabilities-section li {
        margin-bottom: 0.8rem;
      }
      
      code {
        font-family: 'Courier New', monospace;
        background-color: #333;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-size: 0.9em;
      }
      
      .footer {
        margin-top: 3rem;
        padding-top: 1.5rem;
        border-top: 1px solid #444;
        text-align: center;
        font-style: italic;
        color: #888;
      }
      
      /* Responsive styles */
      @media (max-width: 768px) {
        :host {
          padding: 1rem;
        }
        
        h1 {
          font-size: 2em;
        }
        
        h2 {
          font-size: 1.5em;
        }
      }
    `;

    // Render initial template
    shadow.appendChild(style);
    this.render();
  }

  // Lifecycle: when element is added to DOM
  connectedCallback(): void {
    // Ensure component is fully rendered
    if (this.shadowRoot) {
      this.render();
    }
  }

  // Lifecycle: when attributes change
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'title' && oldValue !== newValue) {
      this._title = newValue || 'TypeScript PWA Template';

      // Update title if already rendered
      if (this.shadowRoot) {
        // Use a type assertion to handle the TypeScript error
        const shadow = this.shadowRoot as ShadowRoot;
        const titleElement = shadow.querySelector('h1');
        if (titleElement) {
          titleElement.textContent = this._title;
        }
      }
    }
  }

  /**
   * Render the app content
   */
  private render(): void {
    // Create app container
    const container = document.createElement('div');

    // Create title
    const titleElement = document.createElement('h1');
    titleElement.textContent = this._title;
    container.appendChild(titleElement);

    // Create intro section
    const intro = document.createElement('div');
    intro.className = 'intro';

    const introText = document.createElement('p');
    introText.innerHTML =
      'A modern, lightweight <strong>TypeScript Progressive Web App template</strong> with Web Components and GitHub Pages deployment.';
    intro.appendChild(introText);
    container.appendChild(intro);

    // Features section
    const features = document.createElement('div');
    features.className = 'features-container';

    const featuresTitle = document.createElement('h2');
    featuresTitle.textContent = 'Features';
    features.appendChild(featuresTitle);

    const featuresList = document.createElement('ul');
    featuresList.className = 'features-list';

    const featureItems = [
      'TypeScript with strict type checking',
      'Custom Web Components without frameworks',
      'Vite for fast development and optimized builds',
      'Progressive Web App (PWA) support with offline capabilities',
      'GitHub Pages deployment through GitHub Actions',
      'Comprehensive testing with Vitest',
      'Modern ESLint and Prettier configuration',
      'DevContainer and GitHub Codespaces ready',
    ];

    featureItems.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      featuresList.appendChild(li);
    });

    features.appendChild(featuresList);
    container.appendChild(features);

    // Example component with counter
    const demoSection = document.createElement('div');
    demoSection.className = 'demo-section';

    const demoTitle = document.createElement('h2');
    demoTitle.textContent = 'Interactive Demo';
    demoSection.appendChild(demoTitle);

    const demoDescription = document.createElement('p');
    demoDescription.textContent =
      'This counter demonstrates the interactive functionality you can build with this template:';
    demoSection.appendChild(demoDescription);

    // Create a counter component
    const counter = document.createElement('app-counter');
    counter.setAttribute('label', 'Counter');
    counter.setAttribute('count', '0');

    demoSection.appendChild(counter);
    container.appendChild(demoSection);

    // Key Capabilities section
    const capabilities = document.createElement('div');
    capabilities.className = 'capabilities-section';

    const capabilitiesTitle = document.createElement('h2');
    capabilitiesTitle.textContent = 'Key Capabilities';
    capabilities.appendChild(capabilitiesTitle);

    const capabilitiesList = document.createElement('ol');

    const capabilityItems = [
      'Offline support with Service Worker caching',
      'TypeScript for robust, type-safe code',
      'Web Components for modular UI architecture',
      'Fast builds and hot module replacement',
      'Modern tooling with ESLint and Prettier',
      'Comprehensive test infrastructure',
      'Continuous integration and deployment',
    ];

    capabilityItems.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = item;
      capabilitiesList.appendChild(li);
    });

    capabilities.appendChild(capabilitiesList);
    container.appendChild(capabilities);

    // Create footer
    const footer = document.createElement('footer');
    footer.className = 'footer';

    const footerText = document.createElement('p');
    footerText.innerHTML = 'Built with TypeScript Progressive Web App architecture';
    footer.appendChild(footerText);

    container.appendChild(footer);

    // Add to shadow root (clear existing content first)
    const shadowRoot = this.shadowRoot;
    if (shadowRoot) {
      // Remove any existing content container to avoid duplication
      // Keep only the first child which is the style element
      while (shadowRoot.childNodes.length > 1) {
        shadowRoot.removeChild(shadowRoot.lastChild as Node);
      }

      // Append the new container
      shadowRoot.appendChild(container);
    }
  }
}

// Define the custom element
customElements.define('app-root', AppElement);

/**
 * Create and initialize the app
 * @param rootSelector - Selector for container element to append app to
 * @param title - Optional custom title
 * @returns The created app element
 */
export function createApp(rootSelector: string = '#app', title?: string): AppElement {
  const rootElement = document.querySelector(rootSelector);
  if (!rootElement) {
    throw new Error(`Root element not found: ${rootSelector}`);
  }

  // Create app element
  const app = document.createElement('app-root') as AppElement;
  if (title) {
    app.setAttribute('title', title);
  }

  // Append to root
  rootElement.appendChild(app);

  return app;
}
