import { blocks, ints, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

/** [start, end) */
export type Range = [number, number];

export interface Frame {
  stage: number;
  names: string[];
  /** ranges at every stage up to `stage` (shared) */
  stages: Range[][];
}

const applyMap = (ranges: Range[], rules: number[][]) => {
  const out: Range[] = [];
  let todo = ranges;
  for (const [dest, src, len] of rules) {
    const rest: Range[] = [];
    for (const [lo, hi] of todo) {
      const a = Math.max(lo, src);
      const b = Math.min(hi, src + len);
      if (a < b) {
        out.push([a - src + dest, b - src + dest]);
        if (lo < a) rest.push([lo, a]);
        if (b < hi) rest.push([b, hi]);
      } else rest.push([lo, hi]);
    }
    todo = rest;
  }
  return [...out, ...todo].sort((p, q) => p[0] - q[0]);
};

export const trace: TraceFn<Frame> = (input, part) => {
  const [seedBlock, ...mapBlocks] = blocks(input);
  const seeds = ints(seedBlock);
  let ranges: Range[] =
    part === 1
      ? seeds.map((s) => [s, s + 1])
      : seeds.flatMap((s, i) => (i % 2 ? [] : [[s, s + seeds[i + 1]] as Range]));
  const names = ['seed', ...mapBlocks.map((b) => b.split('-to-')[1].split(' ')[0])];
  const stages: Range[][] = [ranges];
  const frames: Frame[] = [{ stage: 0, names, stages }];
  for (const block of mapBlocks) {
    ranges = applyMap(ranges, lines(block).slice(1).map(ints));
    stages.push(ranges);
    frames.push({ stage: stages.length - 1, names, stages });
  }
  return { frames, answer: Math.min(...ranges.map((r) => r[0])) };
};
