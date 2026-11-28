import { lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Frame {
  bank: string;
  index: number;
  /** positions of the batteries turned on */
  picked: number[];
  joltage: number;
  total: number;
}

/** Greedy: for each of the k digits, take the largest digit leaving enough room after it. */
const pick = (bank: string, k: number) => {
  const picked: number[] = [];
  let from = 0;
  for (let left = k; left > 0; left--) {
    let best = from;
    for (let i = from; i <= bank.length - left; i++) if (bank[i] > bank[best]) best = i;
    picked.push(best);
    from = best + 1;
  }
  return picked;
};

export const trace: TraceFn<Frame> = (input, part) => {
  let total = 0;
  const frames = lines(input).map((bank, index) => {
    const picked = pick(bank, part === 1 ? 2 : 12);
    const joltage = Number(picked.map((i) => bank[i]).join(''));
    total += joltage;
    return { bank, index, picked, joltage, total };
  });
  return { frames, answer: total };
};
