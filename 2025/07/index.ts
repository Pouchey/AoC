import { defaultTransform, parseLines } from '../../utils';
import memoize from '../../utils/memoize';

enum ETile {
  Empty = '.',
  Splitter = '^',
  Tachyon = 'S'
}

const loadData = (input: string) => {
  const data = parseLines(input, defaultTransform<ETile>);

  const start = data[0].findIndex((tile) => tile === ETile.Tachyon);

  return {
    data,
    start
  };
};

const createTachyon = (data: ETile[][], index: number, start: number) => {
  if (data[index][start] === ETile.Empty) {
    data[index][start] = ETile.Tachyon;
    return true;
  }
  return false;
};

const extendBeam = ({
  data,
  starts,
  count,
  index
}: {
  data: ETile[][];
  starts: number[];
  count: number;
  index: number;
}): number => {
  if (!data[index]) return count;

  const nextStarts = starts.map((start) => {
    const tile = data[index][start];
    switch (tile) {
      case ETile.Splitter: {
        let newStarts = [];
        let hasLeftSplitted = false;
        let hasRightSplitted = false;
        // Creating tachyon on the left
        if (data[index][start - 1] && createTachyon(data, index, start - 1)) {
          newStarts.push(start - 1);
          hasLeftSplitted = true;
        }
        // Creating tachyon on the right
        if (data[index][start + 1] && createTachyon(data, index, start + 1)) {
          newStarts.push(start + 1);
          hasRightSplitted = true;
        }
        // Counting splits
        if (hasLeftSplitted && hasRightSplitted) count++;
        else if (hasLeftSplitted) count++;
        else if (hasRightSplitted) count++;

        return newStarts;
      }
      case ETile.Tachyon:
        return [];
      default:
      case ETile.Empty:
        return [start];
    }
  });

  return extendBeam({
    data,
    starts: nextStarts.flat(),
    count,
    index: index + 1
  });
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const result = extendBeam({
    data: data.data,
    starts: [data.start],
    count: 0,
    index: 1
  });

  return result;
};

const extendBeam2 = memoize(
  ({
    data,
    start,
    count,
    index
  }: {
    data: ETile[][];
    start: number;
    count: number;
    index: number;
  }): number => {
    if (!data[index]) return 1;

    const tile = data[index][start];
    if (!tile) return 0;
    switch (tile) {
      case ETile.Splitter:
        return (
          extendBeam2({ data, start: start - 1, count, index: index + 1 }) +
          extendBeam2({ data, start: start + 1, count, index: index + 1 })
        );

      case ETile.Empty:
        return extendBeam2({ data, start: start, count, index: index + 1 });
      default:
      case ETile.Tachyon:
        return 0;
    }
  }
);

export const solve2 = (input: string) => {
  const data = loadData(input);

  const result = extendBeam2({
    data: data.data,
    start: data.start,
    count: 0,
    index: 1
  });

  return result;
};

export const exampleAnswer1 = 21;
export const exampleAnswer2 = 40;

export const firstPartCompleted = true;
