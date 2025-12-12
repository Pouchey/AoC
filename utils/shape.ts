import { type TGrid } from './grid';

export type TShape = boolean[][];

const rotate90 = (shape: TShape): TShape => {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: TShape = Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => false)
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
};

const flipHorizontal = (shape: TShape): TShape => {
  return shape.map((row) => [...row].reverse());
};

export const rotateShape = (shape: TShape, rotation: '90' | '180' | '270' = '90'): TShape => {
  switch (rotation) {
    case '90':
      return rotate90(shape);
    case '180':
      return rotate90(rotate90(shape));
    case '270':
      return rotate90(rotate90(rotate90(shape)));
    default:
      throw new Error('Invalid rotation');
  }
};

export const flipShape = (shape: TShape): TShape => {
  return flipHorizontal(shape);
};

export const generateAllVariants = (shape: TShape): TShape[] => {
  const variants = new Set<string>();
  const result: TShape[] = [];

  let current = shape;

  for (let rot = 0; rot < 4; rot++) {
    for (const flipped of [current, flipHorizontal(current)]) {
      const key = JSON.stringify(flipped);
      if (!variants.has(key)) {
        variants.add(key);
        result.push(flipped);
      }
    }
    current = rotate90(current);
  }

  return result;
};

export const canPlaceShapeAt = (
  shape: TShape,
  grid: TGrid<boolean>,
  x: number,
  y: number
): boolean => {
  if (x < 0 || y < 0) return false;
  if (shape.length === 0 || shape[0].length === 0) return false;

  const rowLength = grid.length;
  const colLength = grid[0].length;
  const shapeHeight = shape.length;
  const shapeWidth = shape[0].length;

  // check if shape is out of bounds (do this first for early exit)
  if (y + shapeHeight > rowLength || x + shapeWidth > colLength) {
    return false;
  }

  for (let row = 0; row < shapeHeight; row++) {
    const shapeRow = shape[row];
    const gridRow = grid[y + row];
    if (!shapeRow || !gridRow) return false;

    for (let col = 0; col < shapeWidth; col++) {
      if (shapeRow[col] && gridRow[x + col]) return false;
    }
  }
  return true;
};

export const countShapeCells = (shape: TShape): number => {
  let count = 0;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) count++;
    }
  }
  return count;
};

const placeShape = (shape: TShape, grid: TGrid<boolean>, x: number, y: number): void => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        grid[y + row][x + col] = true;
      }
    }
  }
};

const removeShape = (shape: TShape, grid: TGrid<boolean>, x: number, y: number): void => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        grid[y + row][x + col] = false;
      }
    }
  }
};

const countAvailableSpace = (grid: TGrid<boolean>): number => {
  return grid.reduce((sum, row) => sum + row.filter((cell) => !cell).length, 0);
};

export const backtrackShape = (grid: TGrid<boolean>, shapes: TShape[]): boolean => {
  if (shapes.length === 0) return true;

  const totalNeeded = shapes.reduce((sum, s) => sum + countShapeCells(s), 0);
  const available = countAvailableSpace(grid);
  if (available < totalNeeded) return false;

  const shape = shapes[0];
  const variants = generateAllVariants(shape);

  const rowLength = grid.length;
  const colLength = grid[0].length;

  for (const variant of variants) {
    const shapeLength = variant.length;
    const shapeWidth = variant[0].length;

    if (shapeLength > rowLength || shapeWidth > colLength) continue;

    for (let y = 0; y <= rowLength - shapeLength; y++) {
      for (let x = 0; x <= colLength - shapeWidth; x++) {
        if (canPlaceShapeAt(variant, grid, x, y)) {
          placeShape(variant, grid, x, y);
          if (backtrackShape(grid, shapes.slice(1))) return true;

          removeShape(variant, grid, x, y);
        }
      }
    }
  }
  return false;
};
