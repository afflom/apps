import { UniversalNumber, PrimeMath } from '@uor-foundation/math-js';

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
