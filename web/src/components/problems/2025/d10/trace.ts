import { ints, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Machine {
  lights: boolean[];
  buttons: number[][];
  joltage: number[];
}

export interface Frame {
  machine: Machine;
  index: number;
  /** how many times each button is pressed in the best solution */
  presses: number[];
  total: number;
  sum: number;
}

const parse = (line: string): Machine => ({
  lights: line
    .slice(line.indexOf('[') + 1, line.indexOf(']'))
    .split('')
    .map((c) => c === '#'),
  buttons: [...line.matchAll(/\(([^)]*)\)/g)].map((m) => ints(m[1])),
  joltage: ints(line.slice(line.indexOf('{')))
});

/** Every subset of buttons pressed once: its press vector and its effect on each counter. */
const subsets = (m: Machine) =>
  Array.from({ length: 1 << m.buttons.length }, (_, mask) => {
    const presses = m.buttons.map((_, b) => (mask >> b) & 1);
    const effect = m.joltage.map(() => 0);
    m.buttons.forEach((btn, b) => presses[b] && btn.forEach((i) => effect[i]++));
    return { presses, effect, count: presses.reduce((a, b) => a + b, 0) };
  });

/** Part 1: lights toggle, so each button is pressed 0 or 1 time; pick the smallest matching subset. */
const solveLights = (m: Machine) => {
  let best: number[] | undefined;
  for (const s of subsets(m))
    if (
      s.effect.every((e, i) => e % 2 === Number(m.lights[i])) &&
      (!best || s.count < best.reduce((a, b) => a + b, 0))
    )
      best = s.presses;
  return best!;
};

/**
 * Part 2: presses x = p + 2y with p in {0,1}^n. The parity of the target fixes which p are
 * possible, and the rest is the same problem on (target - effect(p)) / 2.
 */
const solveJoltage = (m: Machine) => {
  const all = subsets(m);
  const memo = new Map<string, number[] | null>();
  const solve = (target: number[]): number[] | null => {
    if (target.every((t) => t === 0)) return m.buttons.map(() => 0);
    const key = target.join(',');
    if (memo.has(key)) return memo.get(key)!;
    let best: number[] | null = null;
    let bestCount = Infinity;
    for (const s of all) {
      if (!s.effect.every((e, i) => e <= target[i] && (target[i] - e) % 2 === 0)) continue;
      const rest = solve(target.map((t, i) => (t - s.effect[i]) / 2));
      if (!rest) continue;
      const presses = rest.map((r, b) => 2 * r + s.presses[b]);
      const count = presses.reduce((a, b) => a + b, 0);
      if (count < bestCount) {
        bestCount = count;
        best = presses;
      }
    }
    memo.set(key, best);
    return best;
  };
  return solve(m.joltage)!;
};

export const trace: TraceFn<Frame> = (input, part) => {
  let sum = 0;
  const frames = lines(input).map((line, index) => {
    const machine = parse(line);
    const presses = part === 1 ? solveLights(machine) : solveJoltage(machine);
    const total = presses.reduce((a, b) => a + b, 0);
    sum += total;
    return { machine, index, presses, total, sum };
  });
  return { frames, answer: sum };
};
