import { TRange, isInRange, mergeRanges, parseBlocks, parseLines } from '../../utils';

const loadData = (input: string) => {
  const data = parseBlocks(input);

  const ranges: TRange[] = data[0].split('\n').map((range) => {
    const [start, end] = range.split('-').map(Number);
    return [start, end];
  });

  const ids = data[1].split('\n');

  return {
    ranges,
    ids
  };
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const mergedRanges = mergeRanges(data.ranges);

  let result = 0;

  for (const id of data.ids) {
    if (mergedRanges.some((range) => isInRange(parseInt(id), range))) {
      result++;
    }
  }

  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const mergedRanges = mergeRanges(data.ranges);

  const result = mergedRanges.reduce((acc, range) => {
    return acc + (range[1] - range[0] + 1);
  }, 0);

  return result;
};

export const exampleAnswer1 = 3;
export const exampleAnswer2 = 14;

export const firstPartCompleted = true;
