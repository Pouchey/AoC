import { blocks, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

type Range = [number, number];

export interface Frame {
  ranges: Range[];
  merged: Range[];
  /** part 1: ingredient being checked */
  id?: number;
  fresh?: boolean;
  checked: { id: number; fresh: boolean }[];
  count: number;
  label: string;
}

const merge = (ranges: Range[]) => {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out: Range[] = [];
  for (const [lo, hi] of sorted) {
    const last = out[out.length - 1];
    if (last && lo <= last[1] + 1) last[1] = Math.max(last[1], hi);
    else out.push([lo, hi]);
  }
  return out;
};

export const trace: TraceFn<Frame> = (input, part) => {
  const [rangeBlock, idBlock = ''] = blocks(input);
  const ranges = lines(rangeBlock).map((l) => l.split('-').map(Number) as Range);
  const ids = idBlock ? lines(idBlock).map(Number) : [];
  const frames: Frame[] = [];

  if (part === 1) {
    const merged = merge(ranges);
    const checked: Frame['checked'] = [];
    let count = 0;
    frames.push({ ranges, merged, checked: [], count, label: 'fresh ranges' });
    const every = Math.max(1, Math.ceil(ids.length / 400));
    ids.forEach((id, i) => {
      const fresh = merged.some(([lo, hi]) => id >= lo && id <= hi);
      if (fresh) count++;
      checked.push({ id, fresh });
      if (i % every === 0 || i === ids.length - 1)
        frames.push({ ranges, merged, id, fresh, checked: [...checked], count, label: `ID ${id}` });
    });
    return { frames, answer: count };
  }

  // Part 2: merge overlapping ranges one by one, then count the IDs they cover
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const merged: Range[] = [];
  const total = () => merged.reduce((s, [lo, hi]) => s + hi - lo + 1, 0);
  frames.push({ ranges, merged: [], checked: [], count: 0, label: 'sorted by start' });
  sorted.forEach(([lo, hi], i) => {
    const last = merged[merged.length - 1];
    if (last && lo <= last[1] + 1) last[1] = Math.max(last[1], hi);
    else merged.push([lo, hi]);
    frames.push({
      ranges,
      merged: merged.map((r) => [...r] as Range),
      checked: [],
      count: total(),
      label: `range ${i + 1}: ${lo}-${hi}`
    });
  });
  return { frames, answer: total() };
};
