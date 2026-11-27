import { lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Graph {
  nodes: string[];
  edges: [number, number][];
  /** layout: depth (column) and position in the column */
  pos: [number, number][];
  depth: number;
}

export interface Frame {
  graph: Graph;
  /** nodes whose path count is known, in processing order (shared) */
  order: number[];
  done: number;
  /** paths from start to each node (part 2: paths that already saw both dac and fft) */
  ways: number[];
  current: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  const adj = new Map<string, string[]>();
  for (const line of lines(input)) {
    const [name, outs] = line.split(':');
    adj.set(name.trim(), outs.trim().split(/\s+/));
  }
  const start = part === 1 ? 'you' : 'svr';

  // Nodes reachable from start, in topological order (DFS post-order reversed)
  const seen = new Set<string>();
  const post: string[] = [];
  const visit = (n: string) => {
    if (seen.has(n)) return;
    seen.add(n);
    for (const m of adj.get(n) ?? []) visit(m);
    post.push(n);
  };
  visit(start);
  const topo = post.reverse();
  const id = new Map(topo.map((n, i) => [n, i]));
  const edges: [number, number][] = [];
  topo.forEach((n, i) => (adj.get(n) ?? []).forEach((m) => edges.push([i, id.get(m)!])));

  // Layout by longest distance from start
  const depthOf = topo.map(() => 0);
  for (const [a, b] of edges) depthOf[b] = Math.max(depthOf[b], depthOf[a] + 1);
  const depth = Math.max(...depthOf);
  const column = new Map<number, number>();
  const pos = depthOf.map((d) => {
    const k = column.get(d) ?? 0;
    column.set(d, k + 1);
    return [d, k] as [number, number];
  });
  const graph: Graph = { nodes: topo, edges, pos, depth };

  // Path counting; part 2 tracks 4 states: seen neither / dac / fft / both
  const states = part === 1 ? 1 : 4;
  const flag = (n: string) => (part === 1 ? 0 : n === 'dac' ? 1 : n === 'fft' ? 2 : 0);
  const ways = topo.map(() => new Array(states).fill(0));
  ways[0][flag(start)] = 1;
  const order: number[] = [];
  const frames: Frame[] = [];
  const every = Math.max(1, Math.floor(topo.length / 300));
  const shown = () => ways.map((w) => w[states - 1]);
  topo.forEach((n, i) => {
    for (const m of adj.get(n) ?? []) {
      const j = id.get(m)!;
      for (let s = 0; s < states; s++) ways[j][s | flag(m)] += ways[i][s];
    }
    order.push(i);
    if (i % every === 0 || i === topo.length - 1)
      frames.push({ graph, order, done: order.length, ways: shown(), current: i });
  });
  const out = id.get('out')!;
  return { frames, answer: ways[out][states - 1] };
};
