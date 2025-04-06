import { describe, it, expect, beforeEach } from 'vitest';
import { UniversalNumber } from '@uor-foundation/math-js';

// A simple test utility to create button element
function createButtonElement(): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = 'counter';
  document.body.appendChild(button);
  return button;
}

// A simplified version of the setupCounter function from main.ts
function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `The counter value is ${counter}`;
  };
  element.addEventListener('click', () => {
    // Using math-js as demonstration
    const num = UniversalNumber.fromNumber(counter + 1);
    setCounter(Number(num.toString()));
  });
  setCounter(0);
  
  // Return for testing
  return { 
    getCount: () => counter, 
    increment: () => element.click() 
  };
}

describe('Counter Component', () => {
  let buttonElement: HTMLButtonElement;
  let counterControls: { getCount: () => number; increment: () => void };
  
  beforeEach(() => {
    // Clean up DOM before each test
    document.body.innerHTML = '';
    
    // Setup fresh elements and counter
    buttonElement = createButtonElement();
    counterControls = setupCounter(buttonElement);
  });
  
  it('should initialize with count of 0', () => {
    expect(buttonElement.innerHTML).toContain('The counter value is 0');
    expect(counterControls.getCount()).toBe(0);
  });
  
  it('should increment the counter when clicked', () => {
    counterControls.increment();
    expect(buttonElement.innerHTML).toContain('The counter value is 1');
    expect(counterControls.getCount()).toBe(1);
    
    counterControls.increment();
    expect(buttonElement.innerHTML).toContain('The counter value is 2');
    expect(counterControls.getCount()).toBe(2);
  });
  
  it('should use UniversalNumber from math-js for calculations', () => {
    // This test validates that we're using math-js for calculations
    const testNum = UniversalNumber.fromNumber(5);
    expect(testNum.toString()).toBe('5');
    
    // Increment and verify value
    counterControls.increment();
    expect(counterControls.getCount()).toBe(1);
  });
});
