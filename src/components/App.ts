import { createElement, appendElement } from '../utils/dom';
import { createCounter } from './Counter';

/**
 * App component - main application container
 */
export class App {
  private container: HTMLElement;
  
  /**
   * Create the app component
   * @param container - Container element or selector
   */
  constructor(container: string | HTMLElement) {
    this.container = typeof container === 'string'
      ? document.querySelector(container) as HTMLElement
      : container;
      
    if (!this.container) {
      throw new Error(`Container not found: ${container}`);
    }
  }
  
  /**
   * Initialize the app
   */
  init(): void {
    this.render();
    this.setupCounter();
  }
  
  /**
   * Render main app content
   */
  private render(): void {
    this.container.innerHTML = `
      <div>
        <h1>TypeScript PWA Template</h1>
        <div class="card">
          <button id="counter" type="button"></button>
        </div>
        <p class="read-the-docs">
          Click on the button to test the counter
        </p>
      </div>
    `;
  }
  
  /**
   * Setup counter component
   */
  private setupCounter(): void {
    const counter = createCounter('#counter');
    return counter;
  }
}

/**
 * Create and initialize the app
 * @param container - Container element or selector
 * @returns App instance
 */
export function createApp(container: string | HTMLElement = '#app'): App {
  const app = new App(container);
  app.init();
  return app;
}
