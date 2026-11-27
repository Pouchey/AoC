import { findChar, grid } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

type Dir = 'N' | 'E' | 'S' | 'W';
const PIPES: Record<string, Dir[]> = {
  '|': ['N', 'S'],
  '-': ['E', 'W'],
  L: ['N', 'E'],
  J: ['N', 'W'],
  '7': ['S', 'W'],
  F: ['S', 'E']
};
const STEP: Record<Dir, [number, number]> = { N: [-1, 0], E: [0, 1], S: [1, 0], W: [0, -1] };
const BACK: Record<Dir, Dir> = { N: 'S', S: 'N', E: 'W', W: 'E' };

export interface Frame {
  grid: string[][];
  /** BFS distance along the loop, -1 if not on the loop (shared) */
  dist: Int32Array;
  /** part 1: loop shown up to this distance; part 2: rows scanned so far */
  upTo: number;
  inside: Uint8Array;
  far: number;
  enclosed: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  const g = grid(input);
  const R = g.length;
  const W = g[0].length;
  const [sr, sc] = findChar(g, 'S');
  // Which pipe hides under S: the directions whose neighbour connects back
  const sDirs = (Object.keys(STEP) as Dir[]).filter((d) => {
    const [dr, dc] = STEP[d];
    return PIPES[g[sr + dr]?.[sc + dc] ?? '']?.includes(BACK[d]);
  });
  g[sr][sc] = Object.keys(PIPES).find((p) => PIPES[p].every((d) => sDirs.includes(d)))!;

  const dist = new Int32Array(R * W).fill(-1);
  dist[sr * W + sc] = 0;
  let queue = [[sr, sc]];
  let far = 0;
  while (queue.length) {
    const next: number[][] = [];
    for (const [r, c] of queue)
      for (const d of PIPES[g[r][c]] ?? []) {
        const [nr, nc] = [r + STEP[d][0], c + STEP[d][1]];
        if (dist[nr * W + nc] === -1) {
          dist[nr * W + nc] = dist[r * W + c] + 1;
          far = Math.max(far, dist[nr * W + nc]);
          next.push([nr, nc]);
        }
      }
    queue = next;
  }

  const inside = new Uint8Array(R * W);
  const frames: Frame[] = [];
  if (part === 1) {
    const every = Math.max(1, Math.ceil(far / 200));
    for (let d = 0; d <= far; d += every)
      frames.push({ grid: g, dist, upTo: d, inside, far, enclosed: 0 });
    frames.push({ grid: g, dist, upTo: far, inside, far, enclosed: 0 });
    return { frames, answer: far };
  }

  // Part 2: scan each row; crossing a loop pipe that goes north flips inside/outside
  let enclosed = 0;
  for (let r = 0; r < R; r++) {
    let isIn = false;
    for (let c = 0; c < W; c++) {
      if (dist[r * W + c] >= 0) {
        if (PIPES[g[r][c]]?.includes('N')) isIn = !isIn;
      } else if (isIn) {
        inside[r * W + c] = 1;
        enclosed++;
      }
    }
    frames.push({ grid: g, dist, upTo: r, inside, far, enclosed });
  }
  return { frames, answer: enclosed };
};
