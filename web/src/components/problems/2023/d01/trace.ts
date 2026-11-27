import { lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

const WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export interface Hit {
  at: number;
  len: number;
  digit: number;
}

export interface Frame {
  line: string;
  index: number;
  first?: Hit;
  last?: Hit;
  value: number;
  sum: number;
}

const hits = (line: string, words: boolean) => {
  const out: Hit[] = [];
  for (let i = 0; i < line.length; i++) {
    if (/\d/.test(line[i])) out.push({ at: i, len: 1, digit: Number(line[i]) });
    else if (words) {
      const w = WORDS.findIndex((word) => line.startsWith(word, i));
      if (w >= 0) out.push({ at: i, len: WORDS[w].length, digit: w + 1 });
    }
  }
  return out;
};

export const trace: TraceFn<Frame> = (input, part) => {
  let sum = 0;
  const frames = lines(input).map((line, index) => {
    const found = hits(line, part === 2);
    const first = found[0];
    const last = found[found.length - 1];
    const value = first ? first.digit * 10 + last.digit : 0;
    sum += value;
    return { line, index, first, last, value, sum };
  });
  return { frames, answer: sum };
};
