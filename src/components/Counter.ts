import { mathService } from '../services/math';

/**
 * Counter Web Component
 *
 * A custom element that displays a button with a counter
 * that increments when clicked.
 */
export class CounterElement extends HTMLElement {
  private counter: number = 0;
  private button: HTMLButtonElement;

  // Observed attributes for reactive updates
  static get observedAttributes(): string[] {
    return ['count', 'label'];
  }

  constructor() {
    super();

    // Create shadow DOM for encapsulation
    const shadow = this.attachShadow({ mode: 'open' });

    // Create styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }
      
      button {
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #f9f9f9;
        cursor: pointer;
        transition: border-color 0.25s;
        border-radius: 8px;
        border: 1px solid transparent;
      }
      
      button:hover {
        border-color: #646cff;
      }
      
      button:focus,
      button:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
      }
    `;

    // Create button element
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.addEventListener('click', () => this.increment());

    // Add elements to shadow DOM
    shadow.appendChild(style);
    shadow.appendChild(this.button);

    // Set initial state
    this.setCounter(this.getInitialCount());
    this.updateDisplay();
  }

  // Lifecycle: when element is added to DOM
  connectedCallback(): void {
    this.updateDisplay();
  }

  // Lifecycle: when attributes change
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'count' && oldValue !== newValue) {
      this.setCounter(parseInt(newValue, 10) || 0);
    } else if (name === 'label') {
      this.updateDisplay();
    }
  }

  // Get the initial count from attributes or default to 0
  private getInitialCount(): number {
    const countAttr = this.getAttribute('count');
    return countAttr ? parseInt(countAttr, 10) : 0;
  }

  /**
   * Increment counter using math service
   */
  increment(): void {
    const newValue = mathService.increment(this.counter);
    this.setCounter(newValue);

    // Dispatch custom event when counter changes
    this.dispatchEvent(
      new CustomEvent('counter-changed', {
        detail: { value: this.counter },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Set counter value and update display
   * @param count - New counter value
   */
  private setCounter(count: number): void {
    this.counter = count;
    this.setAttribute('count', String(count));
    this.updateDisplay();
  }

  /**
   * Update element display with current counter value
   */
  private updateDisplay(): void {
    const label = this.getAttribute('label') || 'Count';
    this.button.textContent = `${label}: ${this.counter}`;
  }

  /**
   * Get current counter value
   * @returns Current counter value
   */
  getValue(): number {
    return this.counter;
  }
}

// Define the custom element
customElements.define('app-counter', CounterElement);

/**
 * Helper function to add a counter to the page
 * @param parentSelector - Parent element selector to append counter to
 * @param initialCount - Initial counter value
 * @param label - Optional label for the counter
 * @returns The created counter element
 */
export function createCounter(
  parentSelector: string,
  initialCount: number = 0,
  label: string = 'The counter value is'
): CounterElement {
  const parent = document.querySelector(parentSelector);
  if (!parent) {
    throw new Error(`Parent element not found: ${parentSelector}`);
  }

  const counter = document.createElement('app-counter') as CounterElement;
  counter.setAttribute('count', String(initialCount));
  counter.setAttribute('label', label);

  parent.appendChild(counter);
  return counter;
}
