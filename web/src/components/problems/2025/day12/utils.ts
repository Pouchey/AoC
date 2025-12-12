import type { TGrid } from '@aoc/utils/grid';
import type { TShape } from '@aoc/utils/shape';
import type { TXmasTree } from './types';

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

    const giftsShapes: TShape[] = [];
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

// Async version that processes regions in chunks to avoid blocking
export const loadDataAsync = async (
  input: string,
  onProgress?: (progress: number) => void
): Promise<TXmasTree> => {
  const data = input.split('\n\n');

  const giftsLines = data.slice(0, 6);
  const regionsLines = data[6];

  // Parse gifts synchronously (small amount of data)
  const gifts = giftsLines.map((line) => {
    return line
      .split(':')[1]
      .trim()
      .split('\n')
      .map((lines) => lines.split('').map((tile) => tile === '#'));
  });

  // Parse regions in chunks to avoid blocking
  const regionLines = regionsLines.split('\n');
  const regions: TXmasTree['regions'] = [];
  const CHUNK_SIZE = 50; // Process 50 regions at a time

  for (let i = 0; i < regionLines.length; i += CHUNK_SIZE) {
    const chunk = regionLines.slice(i, i + CHUNK_SIZE);

    for (const line of chunk) {
      const [sizeX, sizeY] = line
        .split(':')[0]
        .split('x')
        .map((num) => Number(num));

      const giftsIndexes = line
        .split(' ')
        .slice(1)
        .map((num) => Number(num));

      const giftsShapes: TShape[] = [];
      for (const [index, giftIndex] of giftsIndexes.entries()) {
        if (giftIndex > 0) for (let j = 0; j < giftIndex; j++) giftsShapes.push(gifts[index]);
      }

      regions.push({
        grid: Array.from({ length: sizeY }, () =>
          Array.from({ length: sizeX }).fill(false)
        ) as TGrid<boolean>,
        gifts: giftsShapes
      });
    }

    // Yield to browser after each chunk
    if (i + CHUNK_SIZE < regionLines.length) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (onProgress) {
        onProgress((i + CHUNK_SIZE) / regionLines.length);
      }
    }
  }

  return { gifts, regions };
};

export const placeShape = (shape: TShape, grid: TGrid<boolean>, x: number, y: number): void => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        grid[y + row][x + col] = true;
      }
    }
  }
};

export const removeShape = (shape: TShape, grid: TGrid<boolean>, x: number, y: number): void => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        grid[y + row][x + col] = false;
      }
    }
  }
};

export const GIFT_COLORS = [
  'bg-accent-red',
  'bg-accent-green',
  'bg-accent-blue',
  'bg-accent-gold',
  'bg-accent-purple',
  'bg-accent-red/70'
];
