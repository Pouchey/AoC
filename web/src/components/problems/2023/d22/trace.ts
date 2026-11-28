import { ints, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

// The repo has no solution for this day: answers from the puzzle statement
export const expected = { 1: 5, 2: 7 };

/** [x1, y1, z1, x2, y2, z2] with x1 <= x2 etc. */
export type Brick = number[];

export interface Frame {
  /** original and settled bricks (shared) */
  bricks: Brick[];
  settled: Brick[];
  /** part 1: bricks settled so far; part 2: removed brick and the ones that fall */
  done: number;
  removed?: number;
  falling: Set<number>;
  safe: Set<number>;
  total: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  const bricks = lines(input)
    .map(ints)
    .map(([a, b, c, d, e, f]) => [
      Math.min(a, d),
      Math.min(b, e),
      Math.min(c, f),
      Math.max(a, d),
      Math.max(b, e),
      Math.max(c, f)
    ])
    .sort((p, q) => p[2] - q[2]);
  // Height map: top z and brick id for each (x, y)
  const top = new Map<string, [number, number]>();
  const settled: Brick[] = [];
  const below = bricks.map(() => new Set<number>());
  const above = bricks.map(() => new Set<number>());
  bricks.forEach((b, i) => {
    let floor = 0;
    for (let x = b[0]; x <= b[3]; x++)
      for (let y = b[1]; y <= b[4]; y++) floor = Math.max(floor, top.get(`${x},${y}`)?.[0] ?? 0);
    const dz = b[2] - (floor + 1);
    const s = [b[0], b[1], b[2] - dz, b[3], b[4], b[5] - dz];
    settled.push(s);
    for (let x = b[0]; x <= b[3]; x++)
      for (let y = b[1]; y <= b[4]; y++) {
        const t = top.get(`${x},${y}`);
        if (t && t[0] === floor && floor > 0) {
          below[i].add(t[1]);
          above[t[1]].add(i);
        }
        top.set(`${x},${y}`, [s[5], i]);
      }
  });
  // Safe to disintegrate: every brick it supports has another support
  const safe = new Set(
    bricks.map((_, i) => i).filter((i) => [...above[i]].every((j) => below[j].size > 1))
  );

  const frames: Frame[] = [];
  if (part === 1) {
    const every = Math.max(1, Math.floor(bricks.length / 150));
    for (let k = 0; k <= bricks.length; k += every)
      frames.push({ bricks, settled, done: k, falling: new Set(), safe: new Set(), total: 0 });
    frames.push({
      bricks,
      settled,
      done: bricks.length,
      falling: new Set(),
      safe,
      total: safe.size
    });
    return { frames, answer: safe.size };
  }

  // Part 2: remove each brick and see how many fall in chain
  let total = 0;
  const results = bricks.map((_, i) => {
    const falling = new Set([i]);
    const queue = [i];
    while (queue.length) {
      const j = queue.shift()!;
      for (const k of above[j])
        if (!falling.has(k) && [...below[k]].every((s) => falling.has(s))) {
          falling.add(k);
          queue.push(k);
        }
    }
    falling.delete(i);
    total += falling.size;
    return { i, falling, total };
  });
  const every = Math.max(1, Math.floor(bricks.length / 200));
  results.forEach((r, k) => {
    if (k % every === 0 || k === results.length - 1 || (r.falling.size > 0 && bricks.length < 50))
      frames.push({
        bricks,
        settled,
        done: bricks.length,
        removed: r.i,
        falling: r.falling,
        safe: new Set(),
        total: r.total
      });
  });
  return { frames, answer: total };
};
