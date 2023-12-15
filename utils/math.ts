export enum ESpelledDigit {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
  FOUR = 'four',
  FIVE = 'five',
  SIX = 'six',
  SEVEN = 'seven',
  EIGHT = 'eight',
  NINE = 'nine'
}

export const SPELLED_DIGIT = {
  1: ESpelledDigit.ONE,
  2: ESpelledDigit.TWO,
  3: ESpelledDigit.THREE,
  4: ESpelledDigit.FOUR,
  5: ESpelledDigit.FIVE,
  6: ESpelledDigit.SIX,
  7: ESpelledDigit.SEVEN,
  8: ESpelledDigit.EIGHT,
  9: ESpelledDigit.NINE
};

/**
 * Converts a string representation of a number to a numeric value.
 * If the string is a spelled-out number, it will be converted to its corresponding numeric value.
 * If the string cannot be converted to a number, 0 will be returned.
 *
 * @param str - The string representation of the number.
 * @returns The numeric value of the string.
 */
export const getNumber = (str: string): number => {
  const parsedNumber = parseInt(str, 10);
  if (!isNaN(parsedNumber)) return parsedNumber;

  const spelledNumber = Object.entries(SPELLED_DIGIT).find(
    ([_, spelledNumber]) => spelledNumber === str
  );

  if (!spelledNumber) return 0;

  return parseInt(spelledNumber![0], 10);
};

/**
 * Finds the greatest common divisor (GCD) of two numbers.
 * @param x - The first number.
 * @param y - The second number.
 * @returns The GCD of the two numbers.
 */
export const findGCD = (x: number, y: number) => {
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
