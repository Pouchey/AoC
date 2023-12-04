import path from 'path';
import { readInput } from '../../utils/file';

type Data = string[][];

const loadData = () => {
  const input = readInput(path.join(__dirname, 'data', 'input'));
  const lines = input.split('\n');
  const data: Data = [];

  lines.forEach((line) => {
    const row = line.split('');
    data.push(row);
  });

  return data;
};

const calculate1 = () => {
  const data = loadData();

  const result = 0;

  return result;
};

const calculate2 = () => {
  const data = loadData();

  const result = 0;

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
