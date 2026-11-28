import { ints, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Frame {
  time: number;
  record: number;
  /** first and last winning hold times */
  lo: number;
  hi: number;
  ways: number;
  product: number;
}

const beats = (t: number, d: number, h: number) => h * (t - h) > d;

export const trace: TraceFn<Frame> = (input, part) => {
  const [timeLine, distLine] = lines(input);
  const times = part === 1 ? ints(timeLine) : [Number(timeLine.replace(/\D/g, ''))];
  const dists = part === 1 ? ints(distLine) : [Number(distLine.replace(/\D/g, ''))];
  let product = 1;
  const frames = times.map((time, i) => {
    const record = dists[i];
    // Roots of h * (time - h) = record, then fix rounding
    const root = Math.sqrt(time * time - 4 * record);
    let lo = Math.floor((time - root) / 2);
    let hi = Math.ceil((time + root) / 2);
    while (!beats(time, record, lo)) lo++;
    while (!beats(time, record, hi)) hi--;
    const ways = hi - lo + 1;
    product *= ways;
    return { time, record, lo, hi, ways, product };
  });
  return { frames, answer: product };
};
