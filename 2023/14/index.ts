import { parseLines, ECardinalDirection, invertGrid, sum, defaultTransform } from '../../utils';
import memoize from '../../utils/memoize';

enum ETile {
  Empty = '.',
  FixedRock = '#',
  MovingRock = 'O'
}

const loadData = (input: string) => {
  const data = parseLines(input, defaultTransform<ETile>);
  return data;
};

const moveRocksBis = memoize((data: ETile[][], direction: 'left' | 'right') => {
  const newData = data.map((tiles) => {
    const rocksToMove = tiles
      .map((tile, index) => ({
        tile,
        index
      }))
      .filter(({ tile }) => tile === ETile.MovingRock);
    if (direction === 'right') rocksToMove.reverse();
    for (const { tile, index } of rocksToMove) {
      let newIndex = index;
      if (direction === 'left') {
        while (newIndex > 0 && tiles[newIndex - 1] === ETile.Empty) {
          newIndex--;
        }
      }
      if (direction === 'right') {
        while (newIndex < tiles.length - 1 && tiles[newIndex + 1] === ETile.Empty) {
          newIndex++;
        }
      }
      if (newIndex !== index) {
        tiles[newIndex] = ETile.MovingRock;
        tiles[index] = ETile.Empty;
      }
    }
    return tiles;
  });

  return newData;
});

const moveRocks = memoize((data: ETile[][], dir = ECardinalDirection.North) => {
  switch (dir) {
    case ECardinalDirection.North:
      return invertGrid(moveRocksBis(invertGrid(data), 'left'));
    case ECardinalDirection.West:
      return moveRocksBis(data, 'left');
    case ECardinalDirection.South:
      return invertGrid(moveRocksBis(invertGrid(data), 'right'));
    case ECardinalDirection.East:
      return moveRocksBis(data, 'right');
    default:
      throw new Error('Invalid direction');
  }
});

const moveRocksCycle = memoize((data: ETile[][]) => {
  const north = moveRocks(data, ECardinalDirection.North);
  const west = moveRocks(north, ECardinalDirection.West);
  const south = moveRocks(west, ECardinalDirection.South);
  const east = moveRocks(south, ECardinalDirection.East);

  return east;
});

export const getResult = (rocks: ETile[][]) => {
  const rocksLength = rocks[0].length;
  const counts = rocks.map((tiles, index) => {
    const count = tiles.filter((tile) => tile === ETile.MovingRock).length;
    return count * (rocksLength - index);
  });

  const result = sum(counts);
  return result;
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const rocks = moveRocks(data);

  return getResult(rocks);
};

const CYCLE_TIMES = 1000;

export const solve2 = (input: string) => {
  let data = loadData(input);

  let i = 0;
  do {
    data = moveRocksCycle(data);
    i++;
  } while (i < CYCLE_TIMES);

  return getResult(data);
};

export const exampleAnswer1 = 136;
export const exampleAnswer2 = 64;

export const firstPartCompleted = true;
