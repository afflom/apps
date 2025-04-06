import { UniversalNumber } from '@uor-foundation/math-js';
// PrimeMath utility implementation
interface IPrimeMath {
  gcd: (a: number, b: number) => { toString: () => string };
  isPrime: (n: number) => boolean;
  nextPrime: (n: number) => { toString: () => string };
}

// Real implementation of PrimeMath
const PrimeMath: IPrimeMath = {
  // Greatest common divisor using Euclidean algorithm
  gcd: (a: number, b: number) => {
    const calculateGcd = (x: number, y: number): number => {
      return y === 0 ? x : calculateGcd(y, x % y);
    };
    const result = calculateGcd(Math.abs(a), Math.abs(b));
    return { toString: () => String(result) };
  },

  // Proper prime number check
  isPrime: (n: number) => {
    if (n <= 1) {
      return false;
    }
    if (n <= 3) {
      return true;
    }
    if (n % 2 === 0 || n % 3 === 0) {
      return false;
    }

    // Check for divisibility using 6k±1 optimization
    let i = 5;
    while (i * i <= n) {
      if (n % i === 0 || n % (i + 2) === 0) {
        return false;
      }
      i += 6;
    }
    return true;
  },

  // Find the next prime number
  nextPrime: (n: number) => {
    const findNextPrime = (start: number): number => {
      let next = start + 1;
      // Make sure next is odd
      next = next % 2 === 0 ? next + 1 : next;

      // Limit search to a reasonable number of iterations
      const maxIterations = 1000;
      let iterations = 0;

      while (iterations < maxIterations) {
        iterations++;
        let isPrime = true;
        // Check if next is prime
        if (next <= 1) {
          isPrime = false;
        } else if (next <= 3) {
          isPrime = true;
        } else if (next % 2 === 0 || next % 3 === 0) {
          isPrime = false;
        } else {
          let i = 5;
          while (i * i <= next) {
            if (next % i === 0 || next % (i + 2) === 0) {
              isPrime = false;
              break;
            }
            i += 6;
          }
        }

        if (isPrime) {
          return next;
        }
        next += 2; // Try next odd number
      }

      // Fallback for extreme cases
      return start + 1;
    };

    const result = findNextPrime(n);
    return { toString: () => String(result) };
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
