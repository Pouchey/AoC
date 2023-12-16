import {
  ECardinalDirectionShort,
  TPoint,
  defaultTransform,
  invertGrid,
  parseLines
} from '../../utils';
import memoize from '../../utils/memoize';

enum ETileType {
  Empty = '.',
  VSplitter = '|',
  HSplitter = '-',
  AMirror = '/',
  BMirror = '\\'
}

interface TTile extends TPoint {
  type: ETileType;
  energized: boolean;
}

type TMap = TTile[][];

const transformTile = (char: string, x: number, y: number): TTile => ({
  x,
  y,
  type: char as ETileType,
  energized: false
});

const loadData = (input: string) => {
  const data = parseLines(input, defaultTransform<ETileType>);
  const map: TMap = data.map((line, y) => line.map((char, x) => transformTile(char, x, y)));
  return map;
};

const nextTile = (map: TMap, tile: TTile, dir: ECardinalDirectionShort): TTile | undefined => {
  const { x, y } = tile;
  switch (dir) {
    case ECardinalDirectionShort.North:
      if (!map[y - 1]) return;
      return map[y - 1][x];
    case ECardinalDirectionShort.East:
      if (!map[y][x + 1]) return;
      return map[y][x + 1];
    case ECardinalDirectionShort.South:
      if (!map[y + 1]) return;
      return map[y + 1][x];
    case ECardinalDirectionShort.West:
      if (!map[y][x - 1]) return;
      return map[y][x - 1];
  }
};

const doStep = (map: TMap, cache: Set<string>, tile: TTile, dir: ECardinalDirectionShort) => {
  if (cache.has(`${tile.x},${tile.y},${dir}`)) return;
  tile.energized = true;
  const next = nextTile(map, tile, dir);

  if (!next) return;

  cache.add(`${tile.x},${tile.y},${dir}`);

  if (next.type === ETileType.Empty) doStep(map, cache, next, dir);

  if (next.type === ETileType.VSplitter) {
    if (dir === ECardinalDirectionShort.North || dir === ECardinalDirectionShort.South)
      doStep(map, cache, next, dir);
    else {
      doStep(map, cache, next, ECardinalDirectionShort.South);
      doStep(map, cache, next, ECardinalDirectionShort.North);
    }
  }
  if (next.type === ETileType.HSplitter) {
    if (dir === ECardinalDirectionShort.East || dir === ECardinalDirectionShort.West)
      doStep(map, cache, next, dir);
    else {
      doStep(map, cache, next, ECardinalDirectionShort.East);
      doStep(map, cache, next, ECardinalDirectionShort.West);
    }
  }
  if (next.type === ETileType.AMirror) {
    if (dir === ECardinalDirectionShort.North)
      doStep(map, cache, next, ECardinalDirectionShort.East);
    if (dir === ECardinalDirectionShort.East)
      doStep(map, cache, next, ECardinalDirectionShort.North);
    if (dir === ECardinalDirectionShort.South)
      doStep(map, cache, next, ECardinalDirectionShort.West);
    if (dir === ECardinalDirectionShort.West)
      doStep(map, cache, next, ECardinalDirectionShort.South);
  }
  if (next.type === ETileType.BMirror) {
    if (dir === ECardinalDirectionShort.North)
      doStep(map, cache, next, ECardinalDirectionShort.West);
    if (dir === ECardinalDirectionShort.East)
      doStep(map, cache, next, ECardinalDirectionShort.South);
    if (dir === ECardinalDirectionShort.South)
      doStep(map, cache, next, ECardinalDirectionShort.East);
    if (dir === ECardinalDirectionShort.West)
      doStep(map, cache, next, ECardinalDirectionShort.North);
  }
};

export const solve1 = (input: string) => {
  const map = loadData(input);

  const start = {
    x: -1,
    y: 0,
    type: ETileType.Empty,
    energized: false
  };

  const cache = new Set<string>();

  doStep(map, cache, start, ECardinalDirectionShort.East);

  const result = map.reduce((acc, line) => {
    return acc + line.filter((tile) => tile.energized).length;
  }, 0);

  return result;
};

const cloneMap = (map: TMap) => map.map((line) => line.map((tile) => ({ ...tile })));

const createSteps = (map: TMap) => {
  const steps: {
    map: TMap;
    TTile: TTile;
    direction: ECardinalDirectionShort;
    cache: Set<string>;
  }[] = [];

  const topStarts = map[0].map((tile) => {
    const start = {
      x: tile.x,
      y: -1,
      type: ETileType.Empty,
      energized: false
    };

    const cache = new Set<string>();
    return {
      map: cloneMap(map),
      start,
      direction: ECardinalDirectionShort.South,
      cache
    };
  });

  const bottomStarts = map[map.length - 1].map((tile) => {
    const start = {
      x: tile.x,
      y: map.length,
      type: ETileType.Empty,
      energized: false
    };

    const cache = new Set<string>();
    return {
      map: cloneMap(map),
      start,
      direction: ECardinalDirectionShort.North,
      cache
    };
  });

  const invertedMap = invertGrid(map);

  const leftStarts = invertedMap[0].map((tile) => {
    const start = {
      x: -1,
      y: tile.y,
      type: ETileType.Empty,
      energized: false
    };

    const cache = new Set<string>();
    return {
      map: cloneMap(map),
      start,
      direction: ECardinalDirectionShort.East,
      cache
    };
  });

  const rightStarts = invertedMap[invertedMap.length - 1].map((tile) => {
    const start = {
      x: invertedMap.length,
      y: tile.y,
      type: ETileType.Empty,
      energized: false
    };

    const cache = new Set<string>();
    return {
      map: cloneMap(map),
      start,
      direction: ECardinalDirectionShort.West,
      cache
    };
  });

  return [...topStarts, ...bottomStarts, ...leftStarts, ...rightStarts];
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const steps = createSteps(data);

  const results = steps.map(({ map, start, direction, cache }) => {
    doStep(map, cache, start, direction);
    return map.reduce((acc, line) => {
      return acc + line.filter((tile) => tile.energized).length;
    }, 0);
  });

  const result = Math.max(...results);

  return result;
};

export const exampleAnswer1 = 46;
export const exampleAnswer2 = 51;

export const firstPartCompleted = true;
