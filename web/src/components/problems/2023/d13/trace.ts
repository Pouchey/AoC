import { blocks, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Frame {
  pattern: string[];
  index: number;
  /** mirror between row/col `at - 1` and `at` */
  axis: 'row' | 'col';
  at: number;
  smudge?: [number, number];
  score: number;
  total: number;
}

/** Mirror line with exactly `smudges` differing cells, scanning rows. */
const find = (rows: string[], smudges: number) => {
  for (let at = 1; at < rows.length; at++) {
    let diff = 0;
    let cell: [number, number] | undefined;
    for (let k = 0; k < Math.min(at, rows.length - at) && diff <= smudges; k++) {
      const a = rows[at - 1 - k];
      const b = rows[at + k];
      for (let c = 0; c < a.length; c++)
        if (a[c] !== b[c]) {
          diff++;
          cell = [at + k, c];
        }
    }
    if (diff === smudges) return { at, cell };
  }
  return null;
};

const transpose = (rows: string[]) =>
  rows[0].split('').map((_, c) => rows.map((r) => r[c]).join(''));

export const trace: TraceFn<Frame> = (input, part) => {
  const smudges = part === 1 ? 0 : 1;
  let total = 0;
  const frames = blocks(input).map((block, index) => {
    const pattern = lines(block);
    const h = find(pattern, smudges);
    let frame: Omit<Frame, 'total'>;
    if (h) frame = { pattern, index, axis: 'row', at: h.at, smudge: h.cell, score: 100 * h.at };
    else {
      const v = find(transpose(pattern), smudges)!;
      frame = {
        pattern,
        index,
        axis: 'col',
        at: v.at,
        smudge: v.cell && [v.cell[1], v.cell[0]],
        score: v.at
      };
    }
    total += frame.score;
    return { ...frame, total };
  });
  return { frames, answer: total };
};
