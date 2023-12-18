import { EDirection, TPoint, defaultTransform, lacet, parseLines } from '../../utils';

type TExcavation = {
  dir: EDirection;
  distance: number;
};

const getDirection = (dir: string): EDirection => {
  switch (dir) {
    case 'U':
      return EDirection.Top;
    case 'D':
      return EDirection.Bottom;
    case 'L':
      return EDirection.Left;
    case 'R':
      return EDirection.Right;
    default:
      throw new Error(`Unknown direction: ${dir}`);
  }
};

const loadData = (input: string, hexa = false): TExcavation[] => {
  const data = parseLines(input, defaultTransform, /\s+/);
  return data.map((line) => {
    const [dir, distance, color] = line;

    if (!hexa) {
      const formattedDir = getDirection(dir);
      return { dir: formattedDir, distance: +distance };
    }

    const formattedColor = color.replace(/\(|\)/g, '');
    const formattedDist = parseInt(formattedColor.slice(1, 6), 16);
    let formattedDir: EDirection;
    switch (+formattedColor[6]) {
      case 0:
        formattedDir = EDirection.Right;
        break;
      case 1:
        formattedDir = EDirection.Bottom;
        break;
      case 2:
        formattedDir = EDirection.Left;
        break;
      case 3:
        formattedDir = EDirection.Top;
        break;
      default:
        throw new Error(`Unknown direction: ${formattedColor[6]}`);
    }

    return { dir: formattedDir, distance: +formattedDist };
  });
};

const move = (point: TPoint, dir: EDirection, distance = 1): TPoint => {
  const { x, y } = point;
  switch (dir) {
    case EDirection.Top:
      return { ...point, x: x, y: y - distance };
    case EDirection.Bottom:
      return { ...point, x: x, y: y + distance };
    case EDirection.Left:
      return { ...point, x: x - distance, y: y };
    case EDirection.Right:
      return { ...point, x: x + distance, y: y };
  }
};

const getPoints = (excavations: TExcavation[]) => {
  const visited: TPoint[] = [];
  let current: TPoint = { x: 0, y: 0 };
  let count = 0;
  for (const excavation of excavations) {
    visited.push(current);
    current = move(current, excavation.dir, excavation.distance);
    count += excavation.distance;
  }
  return {
    visited,
    count
  };
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const { visited: points, count } = getPoints(data);
  const area = lacet(points);

  const result = area + count / 2 + 1;

  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input, true);

  const { visited: points, count } = getPoints(data);
  const area = lacet(points);

  const result = area + count / 2 + 1;

  return result;
};

export const exampleAnswer1 = 62;
export const exampleAnswer2 = 952408144115;

export const firstPartCompleted = true;
