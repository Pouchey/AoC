import { DIRS4, grid } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

// The repo has no solution for this day: answers from the puzzle statement
export const expected = { 1: 94, 2: 154 };

const SLOPE: Record<string, number> = { '^': 0, '>': 1, v: 2, '<': 3 };

export interface Edge {
  to: number;
  length: number;
  cells: number[];
}

export interface Frame {
  grid: string[][];
  junctions: number[];
  /** cells of the best path found so far */
  path: number[];
  length: number;
  explored: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  const g = grid(input);
  const R = g.length;
  const W = g[0].length;
  const open = (r: number, c: number) => r >= 0 && c >= 0 && r < R && c < W && g[r][c] !== '#';
  const start = g[0].indexOf('.');
  const end = (R - 1) * W + g[R - 1].indexOf('.');
  // Junctions: start, end and every cell with 3+ open neighbours
  const junctions = [start, end];
  for (let r = 0; r < R; r++)
    for (let c = 0; c < W; c++)
      if (open(r, c) && DIRS4.filter(([dr, dc]) => open(r + dr, c + dc)).length >= 3)
        junctions.push(r * W + c);
  const id = new Map(junctions.map((cell, i) => [cell, i]));

  // Compress corridors into weighted edges between junctions
  const edges: Edge[][] = junctions.map(() => []);
  junctions.forEach((from, i) => {
    for (let d = 0; d < 4; d++) {
      let r = Math.floor(from / W) + DIRS4[d][0];
      let c = (from % W) + DIRS4[d][1];
      if (!open(r, c)) continue;
      const cells = [from];
      let prev = from;
      let ok = true;
      let dir = d;
      for (;;) {
        const ch = g[r][c];
        if (part === 1 && ch in SLOPE && SLOPE[ch] !== dir) {
          ok = false;
          break;
        }
        cells.push(r * W + c);
        if (id.has(r * W + c)) break;
        const nextDir = [0, 1, 2, 3].find((k) => {
          const nr = r + DIRS4[k][0];
          const nc = c + DIRS4[k][1];
          return open(nr, nc) && nr * W + nc !== prev;
        });
        if (nextDir === undefined) {
          ok = false;
          break;
        }
        prev = r * W + c;
        dir = nextDir;
        r += DIRS4[dir][0];
        c += DIRS4[dir][1];
      }
      if (ok)
        edges[i].push({ to: id.get(cells[cells.length - 1])!, length: cells.length - 1, cells });
    }
  });

  // Longest simple path by DFS; when next to the end, going there is the only option
  const endId = 1;
  const beforeEnd = edges.findIndex((list) => list.some((e) => e.to === endId));
  const visited = new Uint8Array(junctions.length);
  const stack: Edge[] = [];
  const frames: Frame[] = [];
  let best = -1;
  let explored = 0;
  const dfs = (node: number, length: number) => {
    if (node === endId) {
      explored++;
      if (length > best) {
        best = length;
        frames.push({ grid: g, junctions, path: stack.flatMap((e) => e.cells), length, explored });
      }
      return;
    }
    visited[node] = 1;
    for (const e of edges[node]) {
      if (visited[e.to] || (node === beforeEnd && e.to !== endId)) continue;
      stack.push(e);
      dfs(e.to, length + e.length);
      stack.pop();
    }
    visited[node] = 0;
  };
  dfs(0, 0);
  frames.push({ ...frames[frames.length - 1], explored });
  return { frames, answer: best };
};
