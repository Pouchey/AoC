import * as path from 'path';
import { readInput as readInputUtil } from '../../utils/file';

type Data = string[];

const loadData = () => {
  const input = readInputUtil(path.join(__dirname, 'data', 'input'));
  const lines = input.split('\n');
  const data: Data = lines;

  return data;
};

const regex1 = /Card\s+(\d+):\s*((?:\s*\d+)+) \|\s*((?:\s*\d+)+)/g;

const calculate1 = () => {
  const data = loadData();

  const result = data.reduce((acc, cur) => {
    const matches = [...cur.matchAll(regex1)];
    const winNumbers = matches[0][2]
      .replace(/\s\s+/g, ' ')
      .split(' ')
      .map((n) => parseInt(n, 10));

    const ownedNumbers = matches[0][3]
      .replace(/\s\s+/g, ' ')
      .split(' ')
      .map((n) => parseInt(n, 10));

    const winnedNumbers = winNumbers.filter((n) => ownedNumbers.includes(n));

    if (winnedNumbers.length === 1) return acc + 1;
    if (winnedNumbers.length > 1) return acc + Math.pow(2, winnedNumbers.length - 1);

    return acc;
  }, 0);

  return result;
};

const calculate2 = () => {
  const data = loadData();

  const points = data.map((card) => {
    const matches = [...card.matchAll(regex1)];
    const winNumbers = matches[0][2]
      .replace(/\s\s+/g, ' ')
      .split(' ')
      .map((n) => parseInt(n, 10));

    const ownedNumbers = matches[0][3]
      .replace(/\s\s+/g, ' ')
      .split(' ')
      .map((n) => parseInt(n, 10));

    const winnedNumbers = ownedNumbers.filter((n) => winNumbers.includes(n));
    return winnedNumbers.length;
  });

  const cards: number[] = Array.from({ length: points.length }, () => 1);

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (point > 0)
      for (let j = 1; j <= point; ++j) {
        cards[i + j] += 1 * cards[i];
      }
  }

  const result = cards.reduce((acc, cur) => acc + cur, 0);

  return result;
};

export default () => {
  const firstStep = calculate1();
  const secondStep = calculate2();

  console.log('');
  console.log('Result of first step:');
  console.log(firstStep);
  console.log('');
  console.log('Result of second step:');
  console.log(secondStep);
  console.log('');
};
