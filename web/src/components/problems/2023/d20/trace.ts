import { lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

// The repo has no solution for this day; the example only covers part 1
export const expected = { 1: 32000000 };
export const parts = [1];
export const noInputCheck = [2];

export interface Module {
  name: string;
  kind: '%' | '&' | 'b' | 'out';
  outputs: string[];
}

export interface Frame {
  modules: Module[];
  /** flip-flop states after this press */
  on: Set<string>;
  press: number;
  low: number;
  high: number;
  /** part 2: press at which each input of the final conjunction first sent high */
  cycles: [string, number][];
}

export const trace: TraceFn<Frame> = (input, part) => {
  const map = new Map<string, Module>();
  for (const line of lines(input)) {
    const [left, right] = line.split(' -> ');
    const kind = left === 'broadcaster' ? 'b' : (left[0] as '%' | '&');
    const name = kind === 'b' ? left : left.slice(1);
    map.set(name, { name, kind, outputs: right.split(', ') });
  }
  for (const m of [...map.values()])
    for (const o of m.outputs) if (!map.has(o)) map.set(o, { name: o, kind: 'out', outputs: [] });
  const modules = [...map.values()];
  const memory = new Map<string, Map<string, boolean>>();
  for (const m of modules) if (m.kind === '&') memory.set(m.name, new Map());
  for (const m of modules) for (const o of m.outputs) memory.get(o)?.set(m.name, false);
  const on = new Set<string>();

  // Part 2: rx is fed by one conjunction; rx gets low when all its inputs send high on the same press
  const feeder = part === 2 ? modules.find((m) => m.outputs.includes('rx')) : undefined;
  if (part === 2 && !feeder)
    throw new Error('Part 2 only works on the real input (the example has no rx module).');
  const watched = feeder ? [...memory.get(feeder.name)!.keys()] : [];
  const cycles = new Map<string, number>();

  let low = 0;
  let high = 0;
  const frames: Frame[] = [];
  const presses = part === 1 ? 1000 : 100000;
  for (let press = 1; press <= presses; press++) {
    const queue: [string, string, boolean][] = [['button', 'broadcaster', false]];
    for (let i = 0; i < queue.length; i++) {
      const [from, to, pulse] = queue[i];
      if (pulse) high++;
      else low++;
      if (feeder && to === feeder.name && pulse && !cycles.has(from)) cycles.set(from, press);
      const m = map.get(to)!;
      let out: boolean | undefined;
      if (m.kind === 'b') out = pulse;
      else if (m.kind === '%' && !pulse) {
        if (on.has(to)) on.delete(to);
        else on.add(to);
        out = on.has(to);
      } else if (m.kind === '&') {
        const mem = memory.get(to)!;
        mem.set(from, pulse);
        out = ![...mem.values()].every(Boolean);
      }
      if (out !== undefined) for (const o of m.outputs) queue.push([to, o, out]);
    }
    const found = cycles.size === watched.length && part === 2;
    if (press <= 20 || press % (part === 1 ? 10 : 25) === 0 || found || press === presses)
      frames.push({ modules, on: new Set(on), press, low, high, cycles: [...cycles] });
    if (found) break;
  }
  if (part === 1) return { frames, answer: low * high };
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  return { frames, answer: [...cycles.values()].reduce((a, b) => (a / gcd(a, b)) * b, 1) };
};
