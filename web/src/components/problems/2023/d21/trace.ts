import { DIRS4, findChar, grid } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

// Part 2 is about the real input's structure (26501365 steps on an infinite map)
export const parts = [1];

export interface Frame {
  grid: string[][];
  /** how many copies of the map are drawn in each direction around the original */
  tiles: number;
  /** BFS distance from S on the tiled map, -1 if unreached (shared) */
  dist: Int32Array;
  step: number;
  reachable: number;
  samples: number[];
}

/** BFS on the map repeated `tiles` times around the center (2 * tiles + 1 copies per side). */
const bfs = (g: string[][], tiles: number, maxSteps: number) => {
  const n = g.length;
  const size = n * (2 * tiles + 1);
  const [sr, sc] = findChar(g, 'S');
  const dist = new Int32Array(size * size).fill(-1);
  const start = (sr + tiles * n) * size + sc + tiles * n;
  dist[start] = 0;
  let frontier = [start];
  for (let d = 1; d <= maxSteps && frontier.length; d++) {
    const next: number[] = [];
    for (const k of frontier) {
      const r = Math.floor(k / size);
      const c = k % size;
      for (const [dr, dc] of DIRS4) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
        const nk = nr * size + nc;
        if (dist[nk] >= 0 || g[nr % n][nc % n] === '#') continue;
        dist[nk] = d;
        next.push(nk);
      }
    }
    frontier = next;
  }
  return dist;
};

/** Plots reachable in exactly `steps`: distance <= steps with the same parity. */
const countAt = (dist: Int32Array, steps: number) => {
  let n = 0;
  for (const d of dist) if (d >= 0 && d <= steps && d % 2 === steps % 2) n++;
  return n;
};

export const trace: TraceFn<Frame> = (input, part) => {
  const g = grid(input);
  const n = g.length;
  const frames: Frame[] = [];
  if (part === 1) {
    const steps = n === 11 ? 6 : 64;
    const dist = bfs(g, 0, steps);
    for (let s = 0; s <= steps; s++)
      frames.push({ grid: g, tiles: 0, dist, step: s, reachable: countAt(dist, s), samples: [] });
    return { frames, answer: countAt(dist, steps) };
  }
  const TOTAL = 26501365;
  const half = TOTAL % n;
  if (n === 11 || (TOTAL - half) % n !== 0)
    throw new Error(
      'Part 2 only works on the real input (its 131×131 map with an empty center row and column).'
    );
  // f(k) = plots after half + k * n steps is quadratic in k: sample k = 0, 1, 2 then extrapolate
  const dist = bfs(g, 2, half + 2 * n);
  const samples = [0, 1, 2].map((k) => countAt(dist, half + k * n));
  const k = (TOTAL - half) / n;
  const [a, b, c] = samples.map(BigInt);
  const K = BigInt(k);
  const answer = a + K * (b - a) + ((K * (K - 1n)) / 2n) * (c - 2n * b + a);
  const every = Math.max(1, Math.floor((half + 2 * n) / 120));
  for (let s = 0; s <= half + 2 * n; s += every)
    frames.push({
      grid: g,
      tiles: 2,
      dist,
      step: s,
      reachable: countAt(dist, s),
      samples: samples.filter((_, i) => half + i * n <= s)
    });
  frames.push({ grid: g, tiles: 2, dist, step: half + 2 * n, reachable: samples[2], samples });
  return { frames, answer: answer.toString() };
};
