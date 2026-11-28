import { DIRS8, grid } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Frame {
  /** rows of the grid: '@' roll, '.' empty, 'x' removed in an earlier wave */
  rows: string[];
  /** cells accessible (fewer than 4 neighbouring rolls) in this wave, as r*cols+c */
  accessible: Set<number>;
  wave: number;
  removed: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  const g = grid(input);
  const R = g.length;
  const Cn = g[0].length;
  const frames: Frame[] = [];
  let removed = 0;
  for (let wave = 1; ; wave++) {
    const accessible = new Set<number>();
    for (let r = 0; r < R; r++)
      for (let c = 0; c < Cn; c++) {
        if (g[r][c] !== '@') continue;
        const n = DIRS8.filter(([dr, dc]) => g[r + dr]?.[c + dc] === '@').length;
        if (n < 4) accessible.add(r * Cn + c);
      }
    frames.push({ rows: g.map((row) => row.join('')), accessible, wave, removed });
    if (accessible.size === 0) break;
    removed += accessible.size;
    if (part === 1) break;
    for (const k of accessible) g[Math.floor(k / Cn)][k % Cn] = 'x';
  }
  if (part === 2) frames[frames.length - 1].removed = removed;
  return { frames, answer: part === 1 ? frames[0].accessible.size : removed };
};
