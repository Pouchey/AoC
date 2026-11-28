import { lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

// The repo has no solution for this day; day 25 has a single part
export const expected = { 1: 54 };
export const parts = [1];
export const noInputCheck = [2];

export interface Frame {
  nodes: string[];
  edges: [number, number][];
  /** 1 if the node ends up on the source side */
  side: Uint8Array;
  cut: [number, number][];
  /** 0 = mixed cloud, 1 = split into two groups */
  t: number;
  sizes: [number, number];
}

export const trace: TraceFn<Frame> = (input) => {
  const ids = new Map<string, number>();
  const id = (n: string) => ids.get(n) ?? (ids.set(n, ids.size), ids.size - 1);
  const edges: [number, number][] = [];
  for (const line of lines(input)) {
    const [a, rest] = line.split(': ');
    for (const b of rest.split(' ')) edges.push([id(a), id(b)]);
  }
  const n = ids.size;
  const adj: [number, number][][] = Array.from({ length: n }, () => []); // [neighbour, edge index]
  edges.forEach(([a, b], e) => {
    adj[a].push([b, e]);
    adj[b].push([a, e]);
  });

  // Max-flow with unit capacities from node 0: the first sink with flow exactly 3 gives the cut
  const flowTo = (sink: number) => {
    const flow = new Map<string, number>(); // "from>to" -> flow
    // Undirected unit edge: capacity 1 each way, flows cancel out
    const residual = (u: number, v: number) =>
      1 - (flow.get(`${u}>${v}`) ?? 0) + (flow.get(`${v}>${u}`) ?? 0);
    for (let found = 0; ; found++) {
      const prev = new Int32Array(n).fill(-1);
      prev[0] = 0;
      const queue = [0];
      for (let i = 0; i < queue.length && prev[sink] < 0; i++)
        for (const [v] of adj[queue[i]])
          if (prev[v] < 0 && residual(queue[i], v) > 0) {
            prev[v] = queue[i];
            queue.push(v);
          }
      if (prev[sink] < 0) return { found, reach: prev };
      if (found === 3) return { found: 4, reach: prev };
      for (let v = sink; v !== 0; v = prev[v]) {
        const u = prev[v];
        const back = flow.get(`${v}>${u}`) ?? 0;
        if (back > 0) flow.set(`${v}>${u}`, back - 1);
        else flow.set(`${u}>${v}`, (flow.get(`${u}>${v}`) ?? 0) + 1);
      }
    }
  };
  for (let sink = 1; sink < n; sink++) {
    const { found, reach } = flowTo(sink);
    if (found !== 3) continue;
    const side = new Uint8Array(n);
    reach.forEach((p, v) => (side[v] = p >= 0 ? 1 : 0));
    const cut = edges.filter(([a, b]) => side[a] !== side[b]);
    const left = side.reduce((s, v) => s + v, 0);
    const sizes: [number, number] = [left, n - left];
    const nodes = [...ids.keys()];
    const frames: Frame[] = [];
    for (let i = 0; i <= 24; i++)
      frames.push({ nodes, edges, side, cut, t: Math.min(1, Math.max(0, (i - 4) / 16)), sizes });
    return { frames, answer: left * (n - left) };
  }
  throw new Error('No 3-edge cut found');
};
