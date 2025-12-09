import { buildPolygon, isRectangleInPolygon, type Point } from '../../utils';
import { max } from '../../utils';

const loadData = (input: string): Point[] => {
  return input.split('\n').map((line) => line.split(',').map(Number) as Point);
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const areas = data
    .map(([x1, y1]) => {
      return data.map(([x2, y2]) => {
        return Math.abs(x1 + 1 - x2) * Math.abs(y1 + 1 - y2);
      });
    })
    .flat();

  return max(areas);
};

export const solve2 = (input: string) => {
  const redTiles = loadData(input);
  const redTileSet = new Set(redTiles.map(([col, row]) => `${col},${row}`));
  const polygon = buildPolygon(redTiles);

  // Generate rectangles from red tile pairs
  const rectangles: Array<{
    rect: { minC: number; maxC: number; minR: number; maxR: number };
    area: number;
  }> = [];

  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      const [col1, row1] = redTiles[i];
      const [col2, row2] = redTiles[j];

      const minC = Math.min(col1, col2);
      const maxC = Math.max(col1, col2);
      const minR = Math.min(row1, row2);
      const maxR = Math.max(row1, row2);

      // Check if opposite corners are red tiles
      const topLeft = `${minC},${minR}`;
      const topRight = `${maxC},${minR}`;
      const bottomLeft = `${minC},${maxR}`;
      const bottomRight = `${maxC},${maxR}`;

      const hasOppositeCorners =
        (redTileSet.has(topLeft) && redTileSet.has(bottomRight)) ||
        (redTileSet.has(topRight) && redTileSet.has(bottomLeft));

      if (hasOppositeCorners) {
        rectangles.push({
          rect: { minC, maxC, minR, maxR },
          area: (maxC - minC + 1) * (maxR - minR + 1)
        });
      }
    }
  }

  // Sort by area descending for early exit
  rectangles.sort((a, b) => b.area - a.area);

  let maxArea = 0;
  for (const { rect, area } of rectangles) {
    if (area <= maxArea) break;
    if (isRectangleInPolygon(rect, polygon)) {
      maxArea = area;
    }
  }

  return maxArea;
};

export const exampleAnswer1 = 50;
export const exampleAnswer2 = 24;

export const firstPartCompleted = true;
