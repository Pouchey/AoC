/**
 * Small pure helpers shared by the day traces.
 * No browser or Vite APIs here: traces are also run by `npm run test:viz` in Node.
 */

export const lines = (input: string) => input.replace(/\r/g, '').trimEnd().split('\n');

export const grid = (input: string) => lines(input).map((line) => line.split(''));

export const ints = (text: string) => (text.match(/-?\d+/g) ?? []).map(Number);

export const blocks = (input: string) =>
  input
    .replace(/\r/g, '')
    .trim()
    .split(/\n\s*\n/);

export const DIRS4: [number, number][] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1]
];

export const DIRS8: [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

export const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/** Keeps at most `max` evenly spaced items, always including the last one. */
export function sample<T>(items: T[], max: number): T[] {
  if (items.length <= max) return items;
  const step = items.length / max;
  const out: T[] = [];
  for (let i = 0; i < max - 1; i++) out.push(items[Math.floor(i * step)]);
  out.push(items[items.length - 1]);
  return out;
}

export const findChar = (g: string[][], ch: string): [number, number] => {
  for (let r = 0; r < g.length; r++) {
    const c = g[r].indexOf(ch);
    if (c >= 0) return [r, c];
  }
  throw new Error(`'${ch}' not found`);
};
