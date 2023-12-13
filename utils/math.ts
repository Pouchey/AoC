/**
 * Finds the greatest common divisor (GCD) of two numbers.
 * @param x - The first number.
 * @param y - The second number.
 * @returns The GCD of the two numbers.
 */
const findGCD = (x: number, y: number) => {
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
};

/**
 * Finds the least common multiple (LCM) of two numbers.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The LCM of the two numbers.
 */
export const findLCM = (a: number, b: number) => {
  return (a * b) / findGCD(a, b);
};

/**
 * Finds the least common multiple (LCM) of an array of numbers.
 * @param numbers - The array of numbers.
 * @returns The LCM of the array of numbers.
 */
export const findLCMs = (numbers: number[]) => numbers.reduce(findLCM);

/**
 * Calculates the sum of an array of numbers.
 * @param numbers - The array of numbers.
 * @returns The sum of the array of numbers.
 */
export const sum = (numbers: number[]) => numbers.reduce((acc, curr) => acc + curr, 0);
