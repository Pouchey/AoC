import { ints, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Frame {
  /** difference rows, the first being the history */
  rows: number[][];
  index: number;
  value: number;
  sum: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  let sum = 0;
  const frames = lines(input).map((line, index) => {
    const rows = [ints(line)];
    while (rows[rows.length - 1].some((v) => v !== 0)) {
      const last = rows[rows.length - 1];
      rows.push(last.slice(1).map((v, i) => v - last[i]));
    }
    // Extrapolate from the bottom row up (forward for part 1, backward for part 2)
    let value = 0;
    for (let r = rows.length - 1; r >= 0; r--) {
      value = part === 1 ? rows[r][rows[r].length - 1] + value : rows[r][0] - value;
      if (part === 1) rows[r].push(value);
      else rows[r].unshift(value);
    }
    sum += value;
    return { rows, index, value, sum };
  });
  return { frames, answer: sum };
};
