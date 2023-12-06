import path from 'path';

import { readInput } from '../../utils/file';

const SPELLED_NUMBERS = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine'
};

const getConvertedNumber = (stringNumber: string): number | undefined => {
  const parsedNumber = parseInt(stringNumber, 10);
  if (!isNaN(parsedNumber)) return parsedNumber;

  const spelledNumber = Object.entries(SPELLED_NUMBERS).find(
    ([_, spelledNumber]) => spelledNumber === stringNumber
  );

  if (!spelledNumber) return;

  return parseInt(spelledNumber![0], 10);
};

const calculate = (regex: RegExp): number => {
  const input = readInput(path.join(__dirname, 'data', 'input'));
  const lines = input.split('\n');

  const numbers = lines.map((line) => {
    const matches = line.matchAll(regex);
    const spelledDigit = Array.from(matches, (match) => match[1]);

    if (!(spelledDigit?.length > 0)) return [0, 0];

    const length = spelledDigit.length;
    const firstNumber = getConvertedNumber(spelledDigit![0]);

    if (length === 1) return [firstNumber, firstNumber];

    const lastNumber = getConvertedNumber(spelledDigit![length - 1]);

    return [firstNumber, lastNumber];
  });

  const addedNumbers = numbers.reduce((acc, curr) => {
    const [firstNumber, lastNumber] = curr;
    return acc + parseInt(`${firstNumber}${lastNumber}`, 10);
  }, 0);

  return addedNumbers;
};

const spelledOrDigitRegex = new RegExp(
  `(?=(${Object.values(SPELLED_NUMBERS).join('|')}|\\d))`,
  'g'
);

const onlyDigitsRegex = new RegExp('(?=(\\d))', 'g');

export default () => {
  const onlyNumbers = calculate(onlyDigitsRegex);
  const withStrings = calculate(spelledOrDigitRegex);

  console.log('');
  console.log('Result of Only numbers:');
  console.log(onlyNumbers);
  console.log('');
  console.log('Result of With strings:');
  console.log(withStrings);
  console.log('');
};
