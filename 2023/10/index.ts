enum EPipe {
  NS = '|',
  EW = '-',
  NE = 'L',
  NW = 'J',
  SE = 'F',
  SW = '7',
  Empty = '.',
  Start = 'S'
}

enum EPossition {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left'
}

type TMap = (EPipe | number)[][];

type TPoint = { x: number; y: number };

const loadData = (input: string) => {
  const lines = input.split('\n');

  const map: TMap = lines.map((line) => line.split('') as EPipe[]);

  return map;
};

const findStart = (map: TMap) => {
  let start: TPoint;

  map.forEach((line, y) => {
    return line.forEach((pipe, x) => {
      if (pipe === EPipe.Start) {
        start = { x, y };
      }
    });
  });

  if (!start!) throw new Error('No start found');

  return start;
};
const findLoopStarts = (map: TMap, start: TPoint) => {
  if (map[start.y][start.x] !== EPipe.Start) throw new Error('Start is not a start');

  const loops: TPoint[] = [];

  const top = map[start.y - 1][start.x];
  const right = map[start.y][start.x + 1];
  const bottom = map[start.y + 1][start.x];
  const left = map[start.y][start.x - 1];

  if (top === EPipe.NS || top === EPipe.SE || top === EPipe.SW)
    loops.push({ x: start.x, y: start.y - 1 });

  if (right === EPipe.EW || right === EPipe.NW || right === EPipe.SW)
    loops.push({ x: start.x + 1, y: start.y });

  if (bottom === EPipe.NS || bottom === EPipe.NE || bottom === EPipe.NW)
    loops.push({ x: start.x, y: start.y + 1 });

  if (left === EPipe.EW || left === EPipe.NE || left === EPipe.SE)
    loops.push({ x: start.x - 1, y: start.y });

  return loops;
};
const getPreviousPosition = (previous: TPoint, current: TPoint) => {
  if (previous.x === current.x && previous.y === current.y - 1) return EPossition.Top;
  if (previous.x === current.x && previous.y === current.y + 1) return EPossition.Bottom;
  if (previous.x === current.x - 1 && previous.y === current.y) return EPossition.Left;
  if (previous.x === current.x + 1 && previous.y === current.y) return EPossition.Right;

  throw new Error('No position found');
};
const getNextPosition = (dir: EPipe, pos: EPossition) => {
  if (dir === EPipe.NS) {
    if (pos === EPossition.Top) return EPossition.Bottom;
    if (pos === EPossition.Bottom) return EPossition.Top;
  }
  if (dir === EPipe.EW) {
    if (pos === EPossition.Left) return EPossition.Right;
    if (pos === EPossition.Right) return EPossition.Left;
  }
  if (dir === EPipe.NE) {
    if (pos === EPossition.Top) return EPossition.Right;
    if (pos === EPossition.Right) return EPossition.Top;
  }
  if (dir === EPipe.NW) {
    if (pos === EPossition.Top) return EPossition.Left;
    if (pos === EPossition.Left) return EPossition.Top;
  }
  if (dir === EPipe.SE) {
    if (pos === EPossition.Bottom) return EPossition.Right;
    if (pos === EPossition.Right) return EPossition.Bottom;
  }
  if (dir === EPipe.SW) {
    if (pos === EPossition.Bottom) return EPossition.Left;
    if (pos === EPossition.Left) return EPossition.Bottom;
  }

  throw new Error('No next position found');
};
const getNextPoint = (map: TMap, current: TPoint, pos: EPossition): TPoint => {
  if (pos === EPossition.Top) return { x: current.x, y: current.y - 1 };
  if (pos === EPossition.Right) return { x: current.x + 1, y: current.y };
  if (pos === EPossition.Bottom) return { x: current.x, y: current.y + 1 };
  if (pos === EPossition.Left) return { x: current.x - 1, y: current.y };

  throw new Error('No next point found');
};
const getNextDirection = (map: TMap, previous: TPoint, current: TPoint) => {
  const currentPipe = map[current.y][current.x];

  const previousPos = getPreviousPosition(previous, current);
  if (!previousPos) throw new Error('No position found');

  if (currentPipe === EPipe.Empty) return null;

  if (currentPipe === EPipe.NS) {
    const nextPos = getNextPosition(currentPipe, previousPos);
    if (!nextPos) throw new Error('No next position found');
    return nextPos;
  }
  if (currentPipe === EPipe.EW) {
    const nextPos = getNextPosition(currentPipe, previousPos);
    if (!nextPos) throw new Error('No next position found');
    return nextPos;
  }
  if (currentPipe === EPipe.NE) {
    const nextPos = getNextPosition(currentPipe, previousPos);
    if (!nextPos) throw new Error('No next position found');
    return nextPos;
  }
  if (currentPipe === EPipe.NW) {
    const nextPos = getNextPosition(currentPipe, previousPos);
    if (!nextPos) throw new Error('No next position found');
    return nextPos;
  }
  if (currentPipe === EPipe.SE) {
    const nextPos = getNextPosition(currentPipe, previousPos);
    if (!nextPos) throw new Error('No next position found');
    return nextPos;
  }
  if (currentPipe === EPipe.SW) {
    const nextPos = getNextPosition(currentPipe, previousPos);
    if (!nextPos) throw new Error('No next position found');
    return nextPos;
  }

  return null;
};
const getNext = (map: TMap, previous: TPoint, current: TPoint) => {
  const nextPos = getNextDirection(map, previous, current)!;
  const nextPoint = getNextPoint(map, current, nextPos)!;

  return nextPoint;
};

const lacet = (path: TPoint[]) => {
  let res = 0;
  for (let i = 0; i < path.length; i++) {
    const pointA = path[i];
    const pointB = path[(i + 1) % path.length];
    res += pointA.x * pointB.y - pointB.x * pointA.y;
  }
  return Math.abs(res) / 2;
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const map = [...data];

  const visited: TPoint[] = [];

  const start: TPoint = findStart(data);
  const loopStarts = findLoopStarts(map, start);
  const firstLoopStart = loopStarts[0];

  let previous: TPoint = start;
  let current: TPoint = firstLoopStart;

  visited.push(previous);
  visited.push(current);

  while (current.x !== start.x || current.y !== start.y) {
    const next = getNext(map, previous, current);
    visited.push(next);
    previous = current;
    current = next;
  }
  const result = (visited.length - 1) / 2;

  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const map = [...data];

  const visited: TPoint[] = [];

  const start: TPoint = findStart(data);
  const loopStarts = findLoopStarts(map, start);
  const firstLoopStart = loopStarts[0];

  let previous: TPoint = start;
  let current: TPoint = firstLoopStart;

  visited.push(previous);
  visited.push(current);

  while (current.x !== start.x || current.y !== start.y) {
    const next = getNext(map, previous, current);
    visited.push(next);
    previous = current;
    current = next;
  }

  const area = lacet(visited);
  const pick = Math.ceil(area - visited.length / 2 + 1);

  const result = pick;

  return result;
};

export const exampleAnswer1 = 4;
export const exampleAnswer2 = 1;

export const firstPartCompleted = true;
