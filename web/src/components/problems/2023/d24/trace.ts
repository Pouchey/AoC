import { ints, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

// The repo has no solution for this day: answers from the puzzle statement
export const expected = { 1: 2, 2: 47 };

export type Stone = number[]; // px, py, pz, vx, vy, vz

export interface Frame {
  stones: Stone[];
  area: [number, number];
  /** part 1: crossings found so far (shared), part 2: rock and hit times */
  crossings: [number, number, boolean][];
  shown: number;
  rock?: Stone;
  hits?: number[];
  count: number;
}

/** Exact Gauss-Jordan on BigInt fractions. */
const solve = (rows: bigint[][]) => {
  const n = rows.length;
  const m = rows.map((r) => r.map((v) => [v, 1n] as [bigint, bigint]));
  const norm = ([a, b]: [bigint, bigint]): [bigint, bigint] => {
    const gcd = (x: bigint, y: bigint): bigint => (y ? gcd(y, x % y) : x < 0n ? -x : x);
    const g = gcd(a, b) || 1n;
    return b < 0n ? [-a / g, -b / g] : [a / g, b / g];
  };
  const sub = (x: [bigint, bigint], y: [bigint, bigint]) =>
    norm([x[0] * y[1] - y[0] * x[1], x[1] * y[1]]);
  const mul = (x: [bigint, bigint], y: [bigint, bigint]) => norm([x[0] * y[0], x[1] * y[1]]);
  const div = (x: [bigint, bigint], y: [bigint, bigint]) => norm([x[0] * y[1], x[1] * y[0]]);
  for (let col = 0; col < n; col++) {
    const pivot = m.findIndex((r, i) => i >= col && r[col][0] !== 0n);
    if (pivot < 0) throw new Error('singular');
    [m[col], m[pivot]] = [m[pivot], m[col]];
    for (let i = 0; i < n; i++) {
      if (i === col || m[i][col][0] === 0n) continue;
      const f = div(m[i][col], m[col][col]);
      m[i] = m[i].map((v, k) => sub(v, mul(f, m[col][k])));
    }
  }
  return m.map((r, i) => div(r[n], r[i]));
};

const throwRock = (stones: Stone[]): Stone => {
  const rows: bigint[][] = [];
  for (const j of [1, 2]) {
    const P = stones[0].slice(0, 3).map(BigInt);
    const V = stones[0].slice(3).map(BigInt);
    const Pj = stones[j].slice(0, 3).map(BigInt);
    const Vj = stones[j].slice(3).map(BigInt);
    const dP = Pj.map((v, k) => v - P[k]);
    const dV = Vj.map((v, k) => v - V[k]);
    const cross = (a: bigint[], b: bigint[]) => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
    const rhs = cross(Pj, Vj).map((v, k) => v - cross(P, V)[k]);
    // (P - Pi) x (V - Vi) = 0 for every hailstone; subtracting two of them is linear in rock P, V
    rows.push([0n, dV[2], -dV[1], 0n, -dP[2], dP[1], rhs[0]]);
    rows.push([-dV[2], 0n, dV[0], dP[2], 0n, -dP[0], rhs[1]]);
    rows.push([dV[1], -dV[0], 0n, -dP[1], dP[0], 0n, rhs[2]]);
  }
  return solve(rows).map(([a, b]) => Number(a / b));
};

export const trace: TraceFn<Frame> = (input, part) => {
  const stones = lines(input).map(ints);
  const area: [number, number] = stones.length < 10 ? [7, 27] : [200000000000000, 400000000000000];
  if (part === 1) {
    const crossings: Frame['crossings'] = [];
    const frames: Frame[] = [];
    let count = 0;
    const every = Math.max(1, Math.floor(stones.length / 150));
    stones.forEach((a, i) => {
      for (let j = 0; j < i; j++) {
        const b = stones[j];
        const det = a[3] * b[4] - a[4] * b[3];
        if (det === 0) continue;
        const t = ((b[0] - a[0]) * b[4] - (b[1] - a[1]) * b[3]) / det;
        const u = ((b[0] - a[0]) * a[4] - (b[1] - a[1]) * a[3]) / det;
        const x = a[0] + a[3] * t;
        const y = a[1] + a[4] * t;
        const inside =
          t >= 0 && u >= 0 && x >= area[0] && x <= area[1] && y >= area[0] && y <= area[1];
        if (inside) count++;
        if (t >= 0 && u >= 0) crossings.push([x, y, inside]);
      }
      if (i % every === 0 || i === stones.length - 1)
        frames.push({ stones, area, crossings, shown: crossings.length, count });
    });
    return { frames, answer: count };
  }
  const rock = throwRock(stones);
  // Time each hailstone is hit, using a coordinate where velocities differ
  const hits = stones.map((s) => {
    const k = [0, 1, 2].find((d) => s[3 + d] !== rock[3 + d])!;
    return (rock[k] - s[k]) / (s[3 + k] - rock[3 + k]);
  });
  const order = hits.map((t, i) => [t, i]).sort((a, b) => a[0] - b[0]);
  const frames: Frame[] = [];
  const every = Math.max(1, Math.floor(stones.length / 120));
  order.forEach((_, k) => {
    if (k % every === 0 || k === order.length - 1)
      frames.push({
        stones,
        area,
        crossings: [],
        shown: k + 1,
        rock,
        hits: order.slice(0, k + 1).map(([, i]) => i),
        count: k + 1
      });
  });
  return { frames, answer: rock[0] + rock[1] + rock[2] };
};
