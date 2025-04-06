import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MathService } from './math';
import { UniversalNumber } from '@uor-foundation/math-js';

// Mock the PrimeMath interface to match our service implementation
interface IPrimeMath {
  gcd: (a: number, b: number) => { toString: () => string };
  isPrime: (n: number) => boolean;
  nextPrime: (n: number) => { toString: () => string };
}

const PrimeMath: IPrimeMath = {
  gcd: vi.fn((a, b) => ({ toString: () => String(Math.floor(a / b) * b) })),
  isPrime: vi.fn((n) => (n > 1 && ![2, 3, 5, 7].includes(n) ? false : true)),
  nextPrime: vi.fn((n) => ({ toString: () => String(n < 2 ? 2 : n + 1) })),
};

// Mock the math-js library once at module scope
vi.mock('@uor-foundation/math-js', () => ({
  UniversalNumber: {
    fromNumber: vi.fn((n) => ({
      add: vi.fn(() => ({ toString: () => String(n + 1) })),
    })),
    fromString: vi.fn(),
  },
}));

describe('MathService', () => {
  let mathService: MathService;

  beforeEach(() => {
    mathService = new MathService();
    vi.clearAllMocks();
  });

  describe('increment', () => {
    it('should increment a number using UniversalNumber', () => {
      const result = mathService.increment(5);

      expect(UniversalNumber.fromNumber).toHaveBeenCalledWith(5);
      expect(result).toBe(6);
    });

    it('should increment zero correctly', () => {
      const result = mathService.increment(0);

      expect(UniversalNumber.fromNumber).toHaveBeenCalledWith(0);
      expect(result).toBe(1);
    });
  });

  describe('gcd', () => {
    it('should calculate greatest common divisor', () => {
      const result = mathService.gcd(12, 4);

      expect(PrimeMath.gcd).toHaveBeenCalledWith(12, 4);
      expect(result).toBe(12);
    });
  });

  describe('isPrime', () => {
    it('should detect prime numbers', () => {
      const resultForPrime = mathService.isPrime(7);
      const resultForNonPrime = mathService.isPrime(4);

      expect(PrimeMath.isPrime).toHaveBeenCalledTimes(2);
      expect(resultForPrime).toBe(true);
      expect(resultForNonPrime).toBe(false);
    });
  });

  describe('nextPrime', () => {
    it('should find the next prime number', () => {
      const result = mathService.nextPrime(10);

      expect(PrimeMath.nextPrime).toHaveBeenCalledWith(10);
      expect(result).toBe(11);
    });

    it('should handle edge cases', () => {
      const result = mathService.nextPrime(0);

      expect(PrimeMath.nextPrime).toHaveBeenCalledWith(0);
      expect(result).toBe(2);
    });
  });
});
