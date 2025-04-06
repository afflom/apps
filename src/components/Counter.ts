import { mathService } from '../services/math';

/**
 * Counter component with increment functionality
 */
export class Counter {
  private element: HTMLButtonElement;
  private counter: number = 0;

  /**
   * Create a new counter component
   * @param element - Button element to attach counter to
   */
  constructor(element: HTMLButtonElement) {
    this.element = element;
    this.setCounter(0);
    this.bindEvents();
  }

  /**
   * Bind event listeners
   */
  private bindEvents(): void {
    this.element.addEventListener('click', () => this.increment());
  }

  /**
   * Increment counter using math service
   */
  increment(): void {
    const newValue = mathService.increment(this.counter);
    this.setCounter(newValue);
  }

  /**
   * Set counter value and update display
   * @param count - New counter value
   */
  private setCounter(count: number): void {
    this.counter = count;
    this.updateDisplay();
  }

  /**
   * Update element display with current counter value
   */
  private updateDisplay(): void {
    this.element.innerHTML = `The counter value is ${this.counter}`;
  }

  /**
   * Get current counter value
   * @returns Current counter value
   */
  getValue(): number {
    return this.counter;
  }
}

/**
 * Create a counter attached to an element
 * @param selector - CSS selector for counter element
 * @returns Counter instance
 */
export function createCounter(selector: string): Counter {
  const element = document.querySelector<HTMLButtonElement>(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  return new Counter(element);
}
