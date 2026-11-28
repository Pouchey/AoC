import { DIRS4, grid } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

// DIRS4 order: up, right, down, left
const TURN: Record<string, number[][]> = {
  '.': [[0], [1], [2], [3]],
  '/': [[1], [0], [3], [2]],
  '\\': [[3], [2], [1], [0]],
  '|': [[0], [0, 2], [2], [0, 2]],
  '-': [[1, 3], [1], [1, 3], [3]]
};

export interface Frame {
  grid: string[][];
  /** step at which each cell was first energized, -1 if never (shared per start) */
  time: Int32Array;
  t: number;
  energized: number;
  start: string;
  best: number;
}

const shine = (g: string[][], r0: number, c0: number, d0: number) => {
  const R = g.length;
  const W = g[0].length;
  const time = new Int32Array(R * W).fill(-1);
  const seen = new Uint8Array(R * W * 4);
  let beams = [[r0, c0, d0]];
  let t = 0;
  let energized = 0;
  while (beams.length) {
    const next: number[][] = [];
    for (const [r, c, d] of beams) {
      if (r < 0 || c < 0 || r >= R || c >= W || seen[(r * W + c) * 4 + d]) continue;
      seen[(r * W + c) * 4 + d] = 1;
      if (time[r * W + c] < 0) {
        time[r * W + c] = t;
        energized++;
      }
      for (const nd of TURN[g[r][c]][d]) next.push([r + DIRS4[nd][0], c + DIRS4[nd][1], nd]);
    }
    beams = next;
    t++;
  }
  return { time, energized, steps: t };
};

export const trace: TraceFn<Frame> = (input, part) => {
  const g = grid(input);
  const frames: Frame[] = [];
  if (part === 1) {
    const { time, energized, steps } = shine(g, 0, 0, 1);
    const every = Math.max(1, Math.ceil(steps / 200));
    for (let t = 0; t <= steps; t += every) {
      let count = 0;
      for (const v of time) if (v >= 0 && v <= t) count++;
      frames.push({ grid: g, time, t, energized: count, start: 'top-left →', best: energized });
    }
    return { frames, answer: energized };
  }
  const R = g.length;
  const W = g[0].length;
  const starts: [number, number, number, string][] = [];
  for (let c = 0; c < W; c++) starts.push([0, c, 2, `top ${c} ↓`], [R - 1, c, 0, `bottom ${c} ↑`]);
  for (let r = 0; r < R; r++) starts.push([r, 0, 1, `left ${r} →`], [r, W - 1, 3, `right ${r} ←`]);
  let best = 0;
  for (const [r, c, d, label] of starts) {
    const { time, energized, steps } = shine(g, r, c, d);
    best = Math.max(best, energized);
    frames.push({ grid: g, time, t: steps, energized, start: label, best });
  }
  return { frames, answer: best };
};
