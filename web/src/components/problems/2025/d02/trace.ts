import type { TraceFn } from '../../viz/types';

export interface Frame {
  range: [number, number];
  index: number;
  /** invalid IDs found in this range with their repeated pattern */
  found: { id: number; pattern: string }[];
  sum: number;
}

/** Builds every number made of a pattern repeated (exactly twice for part 1) inside [lo, hi]. */
const invalidIn = (lo: number, hi: number, part: 1 | 2) => {
  const found = new Map<number, string>();
  for (let len = String(lo).length; len <= String(hi).length; len++) {
    for (let p = 1; p <= len / 2; p++) {
      if (len % p !== 0 || (part === 1 && p * 2 !== len)) continue;
      for (let pattern = 10 ** (p - 1); pattern < 10 ** p; pattern++) {
        const id = Number(String(pattern).repeat(len / p));
        if (id > hi) break;
        if (id >= lo && !found.has(id)) found.set(id, String(pattern));
      }
    }
  }
  return [...found].map(([id, pattern]) => ({ id, pattern })).sort((a, b) => a.id - b.id);
};

export const trace: TraceFn<Frame> = (input, part) => {
  const ranges = input
    .replace(/\s/g, '')
    .split(',')
    .filter(Boolean)
    .map((r) => r.split('-').map(Number) as [number, number]);
  let sum = 0;
  const frames = ranges.map((range, index) => {
    const found = invalidIn(range[0], range[1], part);
    for (const { id } of found) sum += id;
    return { range, index, found, sum };
  });
  return { frames, answer: sum };
};
