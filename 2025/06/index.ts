import { defaultTransform, invertGrid, parseLines } from '../../utils';

const loadData = (input: string) => {
  const data = parseLines(input, defaultTransform, /\s+/);

  const grid = data.map((row) => row.filter((cell) => cell !== ''));

  const reversedGrid = invertGrid(grid);

  const problems = reversedGrid.map((row) => ({
    numbers: row.slice(0, -1),
    operation: row[row.length - 1] as '+' | '*'
  }));

  return problems;
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const result = data.reduce((acc, problem) => {
    const { numbers, operation } = problem;
    const result = numbers.reduce((acc, number) => {
      const num = parseInt(number, 10);
      if (operation === '*') {
        if (acc === 0) return num;

        return acc * num;
      }
      return acc + num;
    }, 0);
    return acc + result;
  }, 0);

  return result;
};

export const solve2 = (input: string) => {
  const data = input.split('\n').map((line) => line.split(''));
  const grid = invertGrid(data);

  let result = 0;
  let currentOperation: '+' | '*' | null = null;
  let currentCalc = 0;

  for (const row of grid) {
    if (!currentOperation) currentOperation = row[row.length - 1] as '+' | '*';

    if (row.every((cell) => cell === ' ')) {
      currentOperation = null;
      console.log(currentCalc);
      result += currentCalc;
      currentCalc = 0;
      continue;
    }

    const number = parseInt(
      row.filter((cell) => cell !== ' ' && cell !== '*' && cell !== '+').join(''),
      10
    );

    if (currentOperation === '+') {
      currentCalc += number;
    } else {
      if (currentCalc === 0) currentCalc = number;
      else currentCalc *= number;
    }
  }
  result += currentCalc;

  return result;
};

export const exampleAnswer1 = 4277556;
export const exampleAnswer2 = 3263827;

export const firstPartCompleted = true;
