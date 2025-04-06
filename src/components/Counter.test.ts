import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Counter, createCounter } from './Counter';
import { mathService } from '../services/math';

// Mock the math service
vi.mock('../services/math', () => ({
  mathService: {
    increment: vi.fn((n) => n + 1)
  }
}));

describe('Counter Component', () => {
  let counterElement: HTMLButtonElement;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Clean up DOM
    document.body.innerHTML = '';
    
    // Create test element
    counterElement = document.createElement('button');
    counterElement.id = 'counter';
    document.body.appendChild(counterElement);
  });
  
  describe('Counter class', () => {
    it('should initialize with counter at 0', () => {
      const counter = new Counter(counterElement);
      expect(counter.getValue()).toBe(0);
      expect(counterElement.innerHTML).toContain('The counter value is 0');
    });
    
    it('should increment counter when called', () => {
      const counter = new Counter(counterElement);
      counter.increment();
      
      expect(mathService.increment).toHaveBeenCalledWith(0);
      expect(counter.getValue()).toBe(1);
      expect(counterElement.innerHTML).toContain('The counter value is 1');
    });
    
    it('should increment multiple times', () => {
      const counter = new Counter(counterElement);
      counter.increment();
      counter.increment();
      counter.increment();
      
      expect(mathService.increment).toHaveBeenCalledTimes(3);
      expect(counter.getValue()).toBe(3);
      expect(counterElement.innerHTML).toContain('The counter value is 3');
    });
    
    it('should increment when clicked', () => {
      const counter = new Counter(counterElement);
      counterElement.click();
      
      expect(mathService.increment).toHaveBeenCalledWith(0);
      expect(counter.getValue()).toBe(1);
    });
  });
  
  describe('createCounter factory', () => {
    it('should create counter attached to the element', () => {
      const counter = createCounter('#counter');
      expect(counter).toBeInstanceOf(Counter);
      expect(counter.getValue()).toBe(0);
    });
    
    it('should throw if element not found', () => {
      expect(() => createCounter('#non-existent')).toThrow('Element not found: #non-existent');
    });
  });
});
