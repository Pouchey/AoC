import { TGrid, TPoint } from '../../utils';

const loadData = (input: string): TGrid<string> => {
  const lines = input.trim().split('\n');
  return lines.map((line) => line.split(''));
};

const countAdjacentRolls = (grid: TGrid<string>, row: number, col: number): number => {
  let count = 0;
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1], // top row
    [0, -1],
    [0, 1], // middle row (left and right)
    [1, -1],
    [1, 0],
    [1, 1] // bottom row
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[newRow].length &&
      grid[newRow][newCol] === '@'
    ) {
      count++;
    }
  }

  return count;
};

const getAccessibleRolls = (grid: TGrid<string>): TPoint[] => {
  const accessibleRolls: TPoint[] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === '@') {
        const adjacentRolls = countAdjacentRolls(grid, row, col);
        if (adjacentRolls < 4) {
          accessibleRolls.push({ x: row, y: col });
        }
      }
    }
  }
  return accessibleRolls;
};

const replaceRolls = (grid: TGrid<string>, rolls: TPoint[]): TGrid<string> => {
  const newGrid = [...grid];
  for (const roll of rolls) {
    newGrid[roll.x][roll.y] = '.';
  }
  return newGrid;
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  let result = 0;

  const accessibleRolls = getAccessibleRolls(data);

  result = accessibleRolls.length;

  return result;
};

export const solve2 = (input: string) => {
  let data = loadData(input);
  let result = 0;

  let accessibleRolls = getAccessibleRolls(data);
  while (accessibleRolls.length > 0) {
    result += accessibleRolls.length;
    data = replaceRolls(data, accessibleRolls);
    accessibleRolls = getAccessibleRolls(data);
  }

  return result;
};

export const exampleAnswer1 = 13;
export const exampleAnswer2 = 43;

export const firstPartCompleted = true;
