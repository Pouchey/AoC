import { ints, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Frame {
  pattern: string;
  groups: number[];
  index: number;
  count: number;
  /** a few concrete arrangements, when the row is small */
  examples: string[];
  sum: number;
}

/** Arrangements of `pattern` matching `groups`, memoized on (position, group index). */
const count = (pattern: string, groups: number[]) => {
  const memo = new Map<number, number>();
  const go = (i: number, gi: number): number => {
    if (i >= pattern.length) return gi === groups.length ? 1 : 0;
    const key = i * 100 + gi;
    if (memo.has(key)) return memo.get(key)!;
    let total = 0;
    if (pattern[i] !== '#') total += go(i + 1, gi);
    const len = groups[gi];
    if (
      pattern[i] !== '.' &&
      gi < groups.length &&
      i + len <= pattern.length &&
      !pattern.slice(i, i + len).includes('.') &&
      pattern[i + len] !== '#'
    )
      total += go(i + len + 1, gi + 1);
    memo.set(key, total);
    return total;
  };
  return go(0, 0);
};

const enumerate = (pattern: string, groups: number[], limit: number) => {
  const out: string[] = [];
  const go = (i: number, gi: number, acc: string) => {
    if (out.length >= limit) return;
    if (i >= pattern.length) {
      if (gi === groups.length) out.push(acc.slice(0, pattern.length));
      return;
    }
    if (pattern[i] !== '#') go(i + 1, gi, acc + '.');
    const len = groups[gi];
    if (
      pattern[i] !== '.' &&
      gi < groups.length &&
      i + len <= pattern.length &&
      !pattern.slice(i, i + len).includes('.') &&
      pattern[i + len] !== '#'
    )
      go(i + len + 1, gi + 1, acc + '#'.repeat(len) + '.');
  };
  go(0, 0, '');
  return out;
};

export const trace: TraceFn<Frame> = (input, part) => {
  let sum = 0;
  const frames = lines(input).map((line, index) => {
    const [base, rest] = line.split(' ');
    let pattern = base;
    let groups = ints(rest);
    if (part === 2) {
      pattern = Array(5).fill(pattern).join('?');
      groups = Array(5).fill(groups).flat();
    }
    const n = count(pattern, groups);
    sum += n;
    return {
      pattern,
      groups,
      index,
      count: n,
      examples: part === 1 ? enumerate(pattern, groups, 8) : [],
      sum
    };
  });
  return { frames, answer: sum };
};
