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
        text-align: center;
      }
      
      h1 {
        font-size: 3.2em;
        line-height: 1.1;
      }
      
      .card {
        padding: 2em;
      }
      
      .read-the-docs {
        color: #888;
      }
    `;

    // Render initial template
    shadow.appendChild(style);
    this.render();
  }

  // Lifecycle: when element is added to DOM
  connectedCallback(): void {
    // Ensure component is fully rendered
    if (!this.shadowRoot!.querySelector('app-counter')) {
      this.render();
    }
  }

  // Lifecycle: when attributes change
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'title' && oldValue !== newValue) {
      this._title = newValue || 'TypeScript PWA Template';

      // Update title if already rendered
      const titleElement = this.shadowRoot!.querySelector('h1');
      if (titleElement) {
        titleElement.textContent = this._title;
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

    // Create card with counter
    const card = document.createElement('div');
    card.className = 'card';

    // Create counter
    const counter = document.createElement('app-counter');
    counter.setAttribute('label', 'The counter value is');
    card.appendChild(counter);
    container.appendChild(card);

    // Create description
    const description = document.createElement('p');
    description.className = 'read-the-docs';
    description.textContent = 'Click on the button to test the counter';
    container.appendChild(description);

    // Add to shadow root (clear existing content first)
    if (this.shadowRoot!.childElementCount > 1) {
      this.shadowRoot!.removeChild(this.shadowRoot!.lastChild!);
    }
    this.shadowRoot!.appendChild(container);
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
