import {
  ECardinalDirection,
  TPoint,
  defaultTransform,
  moveEveryDirection,
  parseLines
} from '../../utils';

enum ETile {
  Empty = '.',
  Start = 'S',
  ROCK = '#',
  Visited = 'O'
}

const findStart = (data: ETile[][]) => {
  let start: TPoint | undefined;
  data.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === ETile.Start) {
        start = { x, y };
      }
    });
  });

  if (!start) throw new Error('No start found');

  return start;
};

const loadData = (input: string) => {
  const data = parseLines(input, defaultTransform<ETile>);

  const start: TPoint = findStart(data);
  // exemple is 6 steps, input is 64 steps
  let limit = 0;
  if (firstPartCompleted) {
    limit = 26501365;
  } else {
    limit = data.length === 11 ? 6 : 64;
  }

  return { grid: data, start, limit };
};

export const solve1 = (input: string) => {
  const { grid, start, limit } = loadData(input);

  const visitTile = (tiles: TPoint[]): TPoint[] => {
    const newTilesSet: Set<string> = new Set();

    for (const tile of tiles) {
      const nextPos = moveEveryDirection(tile, grid, false);
      nextPos.forEach((next) => {
        if (!next) return;
        const nextTile = grid[next.y][next.x];
        if (nextTile !== ETile.ROCK) {
          newTilesSet.add(`${next.x},${next.y}`);
        }
      });
    }
    return Array.from(newTilesSet).map((tile) => ({
      x: Number(tile.split(',')[0]),
      y: Number(tile.split(',')[1])
    }));
  };

  let tiles: TPoint[] = [start];

  for (let step = 0; step < limit; step++) {
    tiles = visitTile(tiles);
  }

  const result = tiles.length;

  return result;
};

export const solve2 = (input: string) => {
  const { grid, start, limit } = loadData(input);
  const gridSize = grid.length;
  const gridWidth = grid[0].length;

  // For infinite grid, we need to track positions with their grid coordinates
  // Position format: "x,y,gridX,gridY" where gridX/gridY indicate which copy of the grid
  const visitTileInfinite = (
    tiles: Map<string, { x: number; y: number; gridX: number; gridY: number }>
  ): Map<string, { x: number; y: number; gridX: number; gridY: number }> => {
    const newTilesMap = new Map<string, { x: number; y: number; gridX: number; gridY: number }>();

    for (const tile of tiles.values()) {
      const directions = [
        { dx: 0, dy: -1 }, // North
        { dx: 0, dy: 1 }, // South
        { dx: 1, dy: 0 }, // East
        { dx: -1, dy: 0 } // West
      ];

      for (const { dx, dy } of directions) {
        let newX = tile.x + dx;
        let newY = tile.y + dy;
        let gridX = tile.gridX;
        let gridY = tile.gridY;

        // Handle wrapping to next grid copy
        if (newX < 0) {
          newX = gridWidth - 1;
          gridX--;
        } else if (newX >= gridWidth) {
          newX = 0;
          gridX++;
        }

        if (newY < 0) {
          newY = gridSize - 1;
          gridY--;
        } else if (newY >= gridSize) {
          newY = 0;
          gridY++;
        }

        // Check if the tile is not a rock
        const tileType = grid[newY][newX];
        if (tileType !== ETile.ROCK) {
          const key = `${newX},${newY},${gridX},${gridY}`;
          newTilesMap.set(key, { x: newX, y: newY, gridX, gridY });
        }
      }
    }

    return newTilesMap;
  };

  // For very large step counts, use quadratic extrapolation
  // The pattern repeats every gridSize steps
  // We'll compute for: rem, rem + gridSize, rem + 2*gridSize
  // where rem = limit % gridSize
  const rem = limit % gridSize;
  const n = Math.floor(limit / gridSize);

  // Compute reachable positions for three key step counts
  const computeReachable = (steps: number): number => {
    let tiles = new Map<string, { x: number; y: number; gridX: number; gridY: number }>();
    tiles.set(`${start.x},${start.y},0,0`, { x: start.x, y: start.y, gridX: 0, gridY: 0 });

    for (let step = 0; step < steps; step++) {
      tiles = visitTileInfinite(tiles);
    }

    return tiles.size;
  };

  // For the actual input (large step count), use quadratic interpolation
  if (limit > 1000) {
    const y0 = computeReachable(rem);
    const y1 = computeReachable(rem + gridSize);
    const y2 = computeReachable(rem + 2 * gridSize);

    // Quadratic interpolation: f(n) = an² + bn + c
    // f(0) = y0, f(1) = y1, f(2) = y2
    // Solving: a = (y2 - 2*y1 + y0) / 2, b = y1 - y0 - a, c = y0
    const a = (y2 - 2 * y1 + y0) / 2;
    const b = y1 - y0 - a;
    const c = y0;

    const result = a * n * n + b * n + c;
    return Math.round(result);
  } else {
    // For smaller step counts (like examples), compute directly
    return computeReachable(limit);
  }
};

export const exampleAnswer1 = 16;
export const exampleAnswer2 = 394693535848011;

export const firstPartCompleted = true;
