import { SPELLED_DIGIT, getNumber } from '../../utils';

const solve = (input: string, regex: RegExp): number => {
  const lines = input.split('\n');

  const numbers = lines.map((line) => {
    const matches = line.matchAll(regex);
    const spelledDigit = Array.from(matches, (match) => match[1]);

    if (!(spelledDigit?.length > 0)) return [0, 0];

    const length = spelledDigit.length;
    const firstNumber = getNumber(spelledDigit[0]);

    if (length === 1) return [firstNumber, firstNumber];

    const lastNumber = getNumber(spelledDigit[length - 1]);

    return [firstNumber, lastNumber];
  });

  const addedNumbers = numbers.reduce((acc, curr) => {
    const [firstNumber, lastNumber] = curr;
    return acc + parseInt(`${firstNumber}${lastNumber}`, 10);
  }, 0);

  return addedNumbers;
};

const spelledOrDigitRegex = new RegExp(`(?=(${Object.values(SPELLED_DIGIT).join('|')}|\\d))`, 'g');

const onlyDigitsRegex = new RegExp('(?=(\\d))', 'g');

export const solve1 = (input: string) => {
  const result = solve(input, onlyDigitsRegex);
  return result;
};

export const solve2 = (input: string) => {
  const result = solve(input, spelledOrDigitRegex);
  return result;
};

export const exampleAnswer1 = 209;
export const exampleAnswer2 = 281;

export const firstPartCompleted = true;
