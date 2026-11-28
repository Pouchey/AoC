import { blocks, ints, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

type Key = 'x' | 'm' | 'a' | 's';
type Rule = { key?: Key; op?: '<' | '>'; value?: number; to: string };
export type Box = Record<Key, [number, number]>;

export interface Frame {
  /** part 1: a part and the workflows it went through */
  rating?: Record<Key, number>;
  path: string[];
  accepted: boolean;
  /** part 2: an accepted box of ratings */
  box?: Box;
  combos: number;
  total: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  const [flowBlock, partBlock] = blocks(input);
  const flows = new Map<string, Rule[]>();
  for (const line of lines(flowBlock)) {
    const [name, body] = line.slice(0, -1).split('{');
    flows.set(
      name,
      body.split(',').map((r) => {
        const m = r.match(/^([xmas])([<>])(\d+):(\w+)$/);
        return m
          ? { key: m[1] as Key, op: m[2] as '<' | '>', value: Number(m[3]), to: m[4] }
          : { to: r };
      })
    );
  }
  const frames: Frame[] = [];
  let total = 0;

  if (part === 1) {
    for (const line of lines(partBlock)) {
      const [x, m, a, s] = ints(line);
      const rating = { x, m, a, s };
      const path = ['in'];
      let at = 'in';
      while (at !== 'A' && at !== 'R') {
        const rule = flows
          .get(at)!
          .find(
            (r) => !r.key || (r.op === '<' ? rating[r.key] < r.value! : rating[r.key] > r.value!)
          )!;
        at = rule.to;
        path.push(at);
      }
      const accepted = at === 'A';
      if (accepted) total += x + m + a + s;
      frames.push({ rating, path, accepted, combos: 0, total });
    }
    return { frames, answer: total };
  }

  // Part 2: push the whole 1..4000 box through, splitting it on every condition
  const volume = (b: Box) =>
    (Object.values(b) as [number, number][]).reduce(
      (v, [lo, hi]) => v * Math.max(0, hi - lo + 1),
      1
    );
  const walk = (at: string, box: Box, path: string[]) => {
    if (at === 'R' || volume(box) === 0) return;
    if (at === 'A') {
      const combos = volume(box);
      total += combos;
      frames.push({ path, accepted: true, box, combos, total });
      return;
    }
    let rest = box;
    for (const rule of flows.get(at)!) {
      if (!rule.key) {
        walk(rule.to, rest, [...path, rule.to]);
        return;
      }
      const [lo, hi] = rest[rule.key];
      const v = rule.value!;
      const yes: [number, number] =
        rule.op === '<' ? [lo, Math.min(hi, v - 1)] : [Math.max(lo, v + 1), hi];
      const no: [number, number] = rule.op === '<' ? [Math.max(lo, v), hi] : [lo, Math.min(hi, v)];
      walk(rule.to, { ...rest, [rule.key]: yes }, [...path, rule.to]);
      rest = { ...rest, [rule.key]: no };
    }
  };
  walk('in', { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }, ['in']);
  return { frames, answer: total };
};
