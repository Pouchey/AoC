import { ints, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export type P3 = [number, number, number];

export interface Frame {
  points: P3[];
  /** all connections in order (shared); this frame shows the first `count` */
  edges: [number, number][];
  count: number;
  circuits: number;
  largest: number[];
}

export const find = (parent: number[], i: number): number => {
  while (parent[i] !== i) i = parent[i] = parent[parent[i]];
  return i;
};

export const trace: TraceFn<Frame> = (input, part) => {
  const points = lines(input).map((l) => ints(l) as P3);
  const n = points.length;
  const pairs: [number, number, number][] = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      const [a, b, c] = points[i];
      const [x, y, z] = points[j];
      pairs.push([(a - x) ** 2 + (b - y) ** 2 + (c - z) ** 2, i, j]);
    }
  pairs.sort((p, q) => p[0] - q[0]);

  const limit = part === 1 ? (n === 20 ? 10 : 1000) : pairs.length;
  const parent = points.map((_, i) => i);
  const size = points.map(() => 1);
  const edges: [number, number][] = [];
  const frames: Frame[] = [];
  let circuits = n;
  let answer = 0;
  const snapshot = () => {
    const sizes = parent
      .map((_, i) => i)
      .filter((i) => find(parent, i) === i)
      .map((i) => size[i]);
    return sizes.sort((a, b) => b - a).slice(0, 3);
  };
  const every = Math.max(1, Math.floor(limit / 500));
  for (let k = 0; k < limit; k++) {
    const [, i, j] = pairs[k];
    edges.push([i, j]);
    const ri = find(parent, i);
    const rj = find(parent, j);
    if (ri !== rj) {
      parent[ri] = rj;
      size[rj] += size[ri];
      circuits--;
    }
    const done = part === 2 && circuits === 1;
    if (k % every === 0 || done || k === limit - 1)
      frames.push({ points, edges, count: edges.length, circuits, largest: snapshot() });
    if (done) {
      answer = points[i][0] * points[j][0];
      break;
    }
  }
  if (part === 1) answer = snapshot().reduce((a, b) => a * b, 1);
  return { frames, answer };
};
