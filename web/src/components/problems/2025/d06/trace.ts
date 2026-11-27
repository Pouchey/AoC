import type { TraceFn } from '../../viz/types';

export interface Frame {
  /** the whole worksheet (shared between frames) */
  rows: string[];
  /** column span of the problem in the worksheet */
  from: number;
  to: number;
  numbers: number[];
  op: '+' | '*';
  value: number;
  total: number;
}

const parseSheet = (input: string) => {
  const rows = input
    .replace(/\r/g, '')
    .split('\n')
    .filter((l) => l.length);
  const width = Math.max(...rows.map((r) => r.length));
  return { rows: rows.map((r) => r.padEnd(width)) };
};

export const trace: TraceFn<Frame> = (input, part) => {
  const { rows } = parseSheet(input);
  const width = rows[0].length;
  const digits = rows.slice(0, -1);
  const opRow = rows[rows.length - 1];
  const blank = (c: number) => rows.every((r) => r[c] === ' ');

  const frames: Frame[] = [];
  let total = 0;
  for (let c = 0; c < width;) {
    if (blank(c)) {
      c++;
      continue;
    }
    let end = c;
    while (end < width && !blank(end)) end++;
    const op = opRow.slice(c, end).trim() as '+' | '*';
    const numbers =
      part === 1
        ? digits.map((r) => Number(r.slice(c, end).trim())).filter((n) => !Number.isNaN(n))
        : // Part 2: one number per column, read top to bottom, columns right to left
          Array.from({ length: end - c }, (_, i) => end - 1 - i)
            .map((col) =>
              digits
                .map((r) => r[col])
                .join('')
                .trim()
            )
            .filter(Boolean)
            .map(Number);
    const value = numbers.reduce((a, n) => (op === '*' ? a * n : a + n), op === '*' ? 1 : 0);
    total += value;
    frames.push({ rows, from: c, to: end, numbers, op, value, total });
    c = end;
  }
  return { frames, answer: total };
};
