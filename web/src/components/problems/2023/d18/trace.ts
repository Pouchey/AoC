import { lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Frame {
  /** polygon vertices (shared); this frame shows the first `count` + 1 */
  points: [number, number][];
  count: number;
  move: string;
  perimeter: number;
  area: number;
}

const STEP: Record<string, [number, number]> = { R: [1, 0], D: [0, 1], L: [-1, 0], U: [0, -1] };

export const trace: TraceFn<Frame> = (input, part) => {
  const moves = lines(input).map((line) => {
    const [d, n, color] = line.split(' ');
    if (part === 1) return { d, n: Number(n) };
    const hex = color.slice(2, 8);
    return { d: 'RDLU'[Number(hex[5])], n: parseInt(hex.slice(0, 5), 16) };
  });
  const points: [number, number][] = [[0, 0]];
  let x = 0;
  let y = 0;
  let twice = 0; // shoelace, doubled
  let perimeter = 0;
  const frames: Frame[] = [];
  moves.forEach(({ d, n }, i) => {
    const nx = x + STEP[d][0] * n;
    const ny = y + STEP[d][1] * n;
    twice += x * ny - nx * y;
    perimeter += n;
    x = nx;
    y = ny;
    points.push([x, y]);
    // Pick's theorem: interior + boundary = |area| + perimeter / 2 + 1
    const area = i === moves.length - 1 ? Math.abs(twice) / 2 + perimeter / 2 + 1 : 0;
    frames.push({ points, count: i + 1, move: `${d} ${n}`, perimeter, area });
  });
  return { frames, answer: frames[frames.length - 1].area };
};
