import { grid } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Frame {
  rows: string[];
  label: string;
  load: number;
  /** part 2: load after each spin cycle (shared) */
  loads: number[];
  cycle?: { start: number; length: number };
}

const load = (g: string[][]) =>
  g.reduce((s, row, r) => s + row.filter((c) => c === 'O').length * (g.length - r), 0);

/** Roll every rock one step north if possible; returns whether something moved. */
const stepNorth = (g: string[][]) => {
  let moved = false;
  for (let r = 1; r < g.length; r++)
    for (let c = 0; c < g[r].length; c++)
      if (g[r][c] === 'O' && g[r - 1][c] === '.') {
        g[r - 1][c] = 'O';
        g[r][c] = '.';
        moved = true;
      }
  return moved;
};

const tiltNorth = (g: string[][]) => {
  for (let c = 0; c < g[0].length; c++) {
    let free = 0;
    for (let r = 0; r < g.length; r++) {
      if (g[r][c] === '#') free = r + 1;
      else if (g[r][c] === 'O') {
        g[r][c] = '.';
        g[free++][c] = 'O';
      }
    }
  }
};

const rotate = (g: string[][]) => g[0].map((_, c) => g.map((row) => row[c]).reverse());

const spin = (g: string[][]) => {
  let cur = g;
  for (let k = 0; k < 4; k++) {
    tiltNorth(cur);
    cur = rotate(cur);
  }
  return cur;
};

export const trace: TraceFn<Frame> = (input, part) => {
  let g = grid(input);
  const snap = () => g.map((r) => r.join(''));
  const frames: Frame[] = [];
  if (part === 1) {
    let step = 0;
    frames.push({ rows: snap(), label: 'start', load: load(g), loads: [] });
    while (stepNorth(g))
      frames.push({ rows: snap(), label: `roll ${++step}`, load: load(g), loads: [] });
    return { frames, answer: load(g) };
  }

  // Part 2: spin until a state repeats, then jump ahead to cycle 1e9
  const TARGET = 1_000_000_000;
  const seen = new Map<string, number>();
  const loads: number[] = [];
  for (let i = 1; ; i++) {
    g = spin(g);
    const key = snap().join('\n');
    loads.push(load(g));
    const first = seen.get(key);
    if (first !== undefined) {
      const length = i - first;
      const cycle = { start: first, length };
      frames.push({
        rows: snap(),
        label: `cycle ${i} = cycle ${first}`,
        load: load(g),
        loads,
        cycle
      });
      const answer = loads[first - 1 + ((TARGET - first) % length)];
      return { frames, answer };
    }
    seen.set(key, i);
    frames.push({ rows: snap(), label: `cycle ${i}`, load: load(g), loads });
  }
};
