import { parseLines } from '../../utils';

const loadData = (input: string) => {
  const data = parseLines(input, (char) => +char);
  return data;
};

const MAX_STRAIGHT = 3;

export const solve1 = (input: string) => {
  const data = loadData(input);

  const start = [0, 0];
  const end = [data.length - 1, data[0].length - 1];
  const visited: boolean[][] = [];

  const result = 0;

  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const result = 0;

  return result;
};

export const exampleAnswer1 = 102;
export const exampleAnswer2 = 0;

export const firstPartCompleted = false;
