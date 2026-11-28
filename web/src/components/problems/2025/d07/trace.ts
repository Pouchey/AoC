import { findChar, grid } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Frame {
  grid: string[][];
  /** beams per row: column -> number of timelines (shared between frames) */
  beams: Map<number, number>[];
  row: number;
  splits: number;
  timelines: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  const g = grid(input);
  const [sr, sc] = findChar(g, 'S');
  const beams: Map<number, number>[] = g.map(() => new Map());
  beams[sr].set(sc, 1);
  let splits = 0;
  const frames: Frame[] = [];
  for (let r = sr + 1; r < g.length; r++) {
    for (const [c, n] of beams[r - 1]) {
      const add = (col: number) => {
        if (col >= 0 && col < g[r].length) beams[r].set(col, (beams[r].get(col) ?? 0) + n);
      };
      if (g[r][c] === '^') {
        splits++;
        add(c - 1);
        add(c + 1);
      } else add(c);
    }
    const timelines = [...beams[r].values()].reduce((a, b) => a + b, 0);
    frames.push({ grid: g, beams, row: r, splits, timelines });
  }
  const last = frames[frames.length - 1];
  return { frames, answer: part === 1 ? last.splits : last.timelines };
};
