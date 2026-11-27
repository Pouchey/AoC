import { DIRS8, grid } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Num {
  r: number;
  c: number;
  len: number;
  value: number;
  part: boolean;
}

export interface Frame {
  grid: string[][];
  numbers: Num[];
  /** part 1: numbers processed; part 2: gears processed */
  done: number;
  /** part 2: gears ('*' next to exactly two numbers) */
  gears: { r: number; c: number; nums: number[]; ratio: number }[];
  current: number;
  total: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  const g = grid(input);
  const isSymbol = (r: number, c: number) => {
    const ch = g[r]?.[c];
    return ch !== undefined && ch !== '.' && !/\d/.test(ch);
  };
  const numbers: Num[] = [];
  g.forEach((row, r) => {
    for (const m of row.join('').matchAll(/\d+/g)) {
      const c = m.index!;
      const len = m[0].length;
      let part = false;
      for (let k = c; k < c + len && !part; k++)
        part = DIRS8.some(([dr, dc]) => isSymbol(r + dr, k + dc));
      numbers.push({ r, c, len, value: Number(m[0]), part });
    }
  });

  const frames: Frame[] = [];
  let total = 0;
  if (part === 1) {
    const every = Math.max(1, Math.floor(numbers.length / 300));
    numbers.forEach((n, i) => {
      if (n.part) total += n.value;
      if (i % every === 0 || i === numbers.length - 1)
        frames.push({ grid: g, numbers, done: i + 1, gears: [], current: i, total });
    });
    return { frames, answer: total };
  }

  const gears: Frame['gears'] = [];
  g.forEach((row, r) =>
    row.forEach((ch, c) => {
      if (ch !== '*') return;
      const nums = numbers
        .map((n, i) => ({ n, i }))
        .filter(({ n }) => Math.abs(n.r - r) <= 1 && c >= n.c - 1 && c <= n.c + n.len)
        .map(({ i }) => i);
      if (nums.length === 2)
        gears.push({ r, c, nums, ratio: numbers[nums[0]].value * numbers[nums[1]].value });
    })
  );
  const every = Math.max(1, Math.floor(gears.length / 300));
  gears.forEach((gear, i) => {
    total += gear.ratio;
    if (i % every === 0 || i === gears.length - 1)
      frames.push({ grid: g, numbers, done: i + 1, gears, current: i, total });
  });
  return { frames, answer: total };
};
