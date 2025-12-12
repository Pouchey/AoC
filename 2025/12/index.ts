import { TGrid, TShape, backtrackShape, countShapeCells } from '../../utils';

export type TRegion = {
  grid: TGrid<boolean>;
  gifts: TShape[];
};

export type TXmasTree = {
  gifts: TShape[];
  regions: TRegion[];
};

export const loadData = (input: string): TXmasTree => {
  const data = input.split('\n\n');

  const giftsLines = data.slice(0, 6);
  const regionsLines = data[6];

  const gifts = giftsLines.map((line) => {
    return line
      .split(':')[1]
      .trim()
      .split('\n')
      .map((lines) => lines.split('').map((tile) => tile === '#'));
  });

  const regions = regionsLines.split('\n').map((line) => {
    const [sizeX, sizeY] = line
      .split(':')[0]
      .split('x')
      .map((num) => Number(num));

    const giftsIndexes = line
      .split(' ')
      .slice(1)
      .map((num) => Number(num));

    let giftsShapes: TShape[] = [];
    for (const [index, giftIndex] of giftsIndexes.entries()) {
      if (giftIndex > 0) for (let i = 0; i < giftIndex; i++) giftsShapes.push(gifts[index]);
    }

    return {
      grid: Array.from({ length: sizeY }, () =>
        Array.from({ length: sizeX }).fill(false)
      ) as TGrid<boolean>,
      gifts: giftsShapes
    };
  });

  return { gifts, regions };
};

export const solve1 = (input: string) => {
  const data = loadData(input);
  const { regions } = data;

  let count = 0;
  for (const region of regions) {
    const sortedGifts = [...region.gifts].sort((a, b) => countShapeCells(b) - countShapeCells(a));

    if (backtrackShape(region.grid, sortedGifts)) {
      count++;
    }
  }

  return count;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const result = 0;

  return result;
};

export const exampleAnswer1 = 2;
export const exampleAnswer2 = 0;

export const firstPartCompleted = true;
