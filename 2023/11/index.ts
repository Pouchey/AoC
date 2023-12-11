interface TPoint {
  x: number;
  y: number;
}

interface TGalaxie extends TPoint {
  index: number;
}

interface TSpace extends TPoint {
  void: number;
}

type TSpaceMap = TPoint[][];

type TGalaxies = TGalaxie[];

type TGalaxyPair = {
  a: TGalaxie;
  b: TGalaxie;
};

const loadData = (input: string, voidLength = 1) => {
  const lines = input.split('\n');

  let count = 0;
  let galaxies: TGalaxies = [];

  const map: TSpaceMap = lines.map((line, y) => {
    const row = line.split('').map((char, x) => {
      if (char === '#') {
        count++;
        const galaxie = { x, y, index: count };
        galaxies.push(galaxie);
        return galaxie;
      }
      return { x, y, void: 0 };
    });
    return row;
  });

  // Add void if row is empty
  map.forEach((row) => {
    if (row.every((point) => Object.hasOwnProperty.call(point, 'void'))) {
      row.forEach((point) => {
        // @ts-expect-error - Instance of TSpace
        point.void = voidLength;
      });
    }
  });

  // Add void if column is empty
  for (let x = 0; x < map[0].length; x++) {
    const column = map.map((row) => row[x]);
    if (column.every((point) => Object.hasOwnProperty.call(point, 'void'))) {
      column.forEach((point) => {
        // @ts-expect-error - Instance of TSpace
        point.void = voidLength;
      });
    }
  }

  return {
    map,
    galaxies
  };
};

const findNext = (map: TSpaceMap, a: TPoint, b: TPoint) => {
  const next = { x: a.x, y: a.y };

  if (a.x < b.x) {
    next.x++;
    return map[next.y][next.x];
  }
  if (a.x > b.x) {
    next.x--;
    return map[next.y][next.x];
  }
  if (a.y < b.y) {
    next.y++;
    return map[next.y][next.x];
  }
  if (a.y > b.y) {
    next.y--;
    return map[next.y][next.x];
  }
  return map[next.y][next.x];
};

const findPath = (map: TSpaceMap, a: TPoint, b: TPoint) => {
  let pathLength = 0;
  let current = a;
  while (current.x !== b.x || current.y !== b.y) {
    const next = findNext(map, current, b);
    let voidCount = 0;
    if (Object.hasOwnProperty.call(next, 'void')) {
      // @ts-expect-error - Instance of TSpace
      voidCount = next.void;
    }
    pathLength += voidCount + 1;
    current = next;
  }
  return pathLength;
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const pairs = data.galaxies.reduce((acc: TGalaxyPair[], galaxie: TGalaxie, index: number) => {
    const pairs = data.galaxies.slice(index + 1).map((galaxie2) => {
      return { a: galaxie, b: galaxie2 };
    });
    return [...acc, ...pairs];
  }, []);

  const paths = pairs.map((pair) => {
    const path = findPath(data.map, pair.a, pair.b);
    return path;
  });

  const result = paths.reduce((acc, path) => {
    return acc + path;
  }, 0);

  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input, 999999);

  const pairs = data.galaxies.reduce((acc: TGalaxyPair[], galaxie: TGalaxie, index: number) => {
    const pairs = data.galaxies.slice(index + 1).map((galaxie2) => {
      return { a: galaxie, b: galaxie2 };
    });
    return [...acc, ...pairs];
  }, []);

  const paths = pairs.map((pair) => {
    const path = findPath(data.map, pair.a, pair.b);
    return path;
  });

  const result = paths.reduce((acc, path) => {
    return acc + path;
  }, 0);

  return result;
};

export const exampleAnswer1 = 374;
export const exampleAnswer2 = 82000210;

export const firstPartCompleted = true;
