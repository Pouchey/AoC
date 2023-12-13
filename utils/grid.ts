import { enumerate } from './array';
export type TGrid<T = unknown> = T[][];

/**
 * Inverts the rows and columns of a grid.
 *
 * @param grid The grid to invert.
 * @returns The inverted grid.
 *
 * @example
 * ```ts
 * invertGrid([[1, 2, 3], [4, 5, 6]]); // [[1, 4], [2, 5], [3, 6]]
 * ```
 */
export const invertGrid = <T = unknown>(grid: TGrid<T>): TGrid<T> => {
  const newGrid: TGrid<T> = [];
  for (const [row, rowIndex] of enumerate(grid)) {
    for (const [col, colIndex] of enumerate(row)) {
      if (!newGrid[colIndex]) newGrid[colIndex] = [];
      newGrid[colIndex][rowIndex] = col;
    }
  }
  return newGrid;
};

/**
 * Converts a grid to a string representation.
 *
 * @template T - The type of the grid elements.
 * @param {TGrid<T>} grid - The grid to convert.
 * @returns {string[]} - The string representation of the grid.
 *
 * @example
 * ```ts
 * convertGridToString([[1, 2, 3], [4, 5, 6]]); // ['123', '456']
 * ```
 */
export const convertGridToString = <T = unknown>(grid: TGrid<T>): string[] => {
  const newGrid: string[] = [];
  for (const row of grid) {
    newGrid.push(row.join(''));
  }
  return newGrid;
};
