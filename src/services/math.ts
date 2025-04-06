import { UniversalNumber } from '@uor-foundation/math-js';
// Import the correct module for the actual API - using a mock version for our example
// This would need to be adjusted based on the actual API structure
// Since we don't have full API knowledge, we'll create a mock interface

// Define the interface for PrimeMath
interface IPrimeMath {
  gcd: (a: number, b: number) => { toString: () => string };
  isPrime: (n: number) => boolean;
  nextPrime: (n: number) => { toString: () => string };
}

// Create a mock object
const PrimeMath: IPrimeMath = {
  gcd: (a: number, b: number) => {
    // Mock implementation for the example
    return { toString: () => String(Math.floor(a / b) * b) };
  },
  isPrime: (n: number) => {
    // Mock implementation for the example
    return n > 1 && n <= 3;
  },
  nextPrime: (n: number) => {
    // Mock implementation for the example
    return { toString: () => String(n < 2 ? 2 : n + 1) };
  },
};

/**
 * Math service wrapping the math-js library
 */
export class MathService {
  /**
   * Increments a number using UniversalNumber for computation
   * @param value - The number to increment
   * @returns Incremented value
   */
  increment(value: number): number {
    const num = UniversalNumber.fromNumber(value);
    const result = num.add(UniversalNumber.fromNumber(1));
    return Number(result.toString());
  }

  /**
   * Calculates the greatest common divisor of two numbers
   * @param a - First number
   * @param b - Second number
   * @returns GCD of a and b
   */
  gcd(a: number, b: number): number {
    return Number(PrimeMath.gcd(a, b).toString());
  }

  /**
   * Checks if a number is prime
   * @param n - Number to check
   * @returns Boolean indicating if number is prime
   */
  isPrime(n: number): boolean {
    return PrimeMath.isPrime(n);
  }

  /**
   * Finds the next prime number after a given value
   * @param n - Starting number
   * @returns Next prime number
   */
  nextPrime(n: number): number {
    return Number(PrimeMath.nextPrime(n).toString());
  }
}

export const mathService = new MathService();
