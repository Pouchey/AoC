import path from 'path';
import { readInput } from '../../utils/file';

type Data = number[][];

const timeRegex = /.:(.*)/g;

const loadData = (merged = false) => {
  const input = readInput(path.join(__dirname, 'data', 'input'));
  const lines = input.split('\n');
  const data: Data = [];

  lines.forEach((line) => {
    const row = [...line.matchAll(timeRegex)][0][1]
      .trim()
      .split(/\s+/)
      .map((item) => +item);
    data.push(row);
  });

  if (merged) {
    const res = data.map((row) => row.map((item) => item.toString()).join(''));
    return res.map((row) => [+row]);
  }

  return data;
};

const calculate1 = () => {
  const data = loadData();
  const [time, distance] = data;
  const wins = time.map((row, index) => {
    const speeds = Array.from({ length: row }, (_, i) => i);
    const distanceForEachSpeed = speeds.map((speed, ind) => speed * (row - ind));

    const numberOfWins = distanceForEachSpeed.filter((dist) => dist > distance[index]).length;
    return numberOfWins;
  });
  const result = wins.reduce((acc, win) => acc * win, 1);

  return result;
};

const calculate2 = () => {
  const data = loadData(true);

  const [time, distance] = data;
  const wins = time.map((row, index) => {
    const speeds = Array.from({ length: row }, (_, i) => i);
    const distanceForEachSpeed = speeds.map((speed, ind) => speed * (row - ind));

    const numberOfWins = distanceForEachSpeed.filter((dist) => dist > distance[index]).length;
    return numberOfWins;
  });
  const result = wins.reduce((acc, win) => acc * win, 1);

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
