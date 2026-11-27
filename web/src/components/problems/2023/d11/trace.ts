import { grid } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Frame {
  rows: number;
  cols: number;
  galaxies: [number, number][];
  emptyRows: number[];
  emptyCols: number[];
  /** 0 = original universe, 1 = fully expanded (drawn with factor 2) */
  t: number;
  factor: number;
  sum: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  const g = grid(input);
  const galaxies: [number, number][] = [];
  g.forEach((row, r) => row.forEach((ch, c) => ch === '#' && galaxies.push([r, c])));
  const emptyRows = g.map((_, r) => r).filter((r) => !g[r].includes('#'));
  const emptyCols = g[0].map((_, c) => c).filter((c) => g.every((row) => row[c] !== '#'));
  const factor = part === 1 ? 2 : 1_000_000;

  // Sum of pairwise distances per axis: sort coordinates, use prefix sums
  const axisSum = (coords: number[]) => {
    coords.sort((a, b) => a - b);
    let total = 0;
    let prefix = 0;
    coords.forEach((v, i) => {
      total += v * i - prefix;
      prefix += v;
    });
    return total;
  };
  const expand = (v: number, empties: number[]) =>
    v + empties.filter((e) => e < v).length * (factor - 1);
  const sum =
    axisSum(galaxies.map(([r]) => expand(r, emptyRows))) +
    axisSum(galaxies.map(([, c]) => expand(c, emptyCols)));

  const base = { rows: g.length, cols: g[0].length, galaxies, emptyRows, emptyCols, factor };
  const frames: Frame[] = [];
  for (let i = 0; i <= 20; i++)
    frames.push({ ...base, t: Math.min(1, i / 16), sum: i >= 17 ? sum : 0 });
  return { frames, answer: sum };
};
