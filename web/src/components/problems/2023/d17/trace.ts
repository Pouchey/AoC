import { DIRS4, grid } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

// The repo has no solution for this day: answers from the puzzle statement
export const expected = { 1: 102, 2: 94 };

export interface Frame {
  heat: number[][];
  /** order in which cells were first settled by Dijkstra (shared) */
  order: Int32Array;
  settled: number;
  path: number[];
  showPath: boolean;
  loss: number;
}

/** Binary min-heap on [cost, state] */
class Heap {
  private a: [number, number][] = [];
  get size() {
    return this.a.length;
  }
  push(x: [number, number]) {
    const a = this.a;
    a.push(x);
    for (let i = a.length - 1; i > 0;) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop()!;
    if (a.length) {
      a[0] = last;
      for (let i = 0; ;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && a[l][0] < a[m][0]) m = l;
        if (r < a.length && a[r][0] < a[m][0]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

export const trace: TraceFn<Frame> = (input, part) => {
  const heat = grid(input).map((row) => row.map(Number));
  const R = heat.length;
  const W = heat[0].length;
  const [minRun, maxRun] = part === 1 ? [1, 3] : [4, 10];
  // State: cell * 2 + axis (0 = last move vertical, 1 = horizontal); each move goes 1..maxRun straight then turns
  const dist = new Float64Array(R * W * 2).fill(Infinity);
  const prev = new Int32Array(R * W * 2).fill(-1);
  const order = new Int32Array(R * W).fill(-1);
  const heap = new Heap();
  dist[0] = dist[1] = 0;
  heap.push([0, 0]);
  heap.push([0, 1]);
  let settled = 0;
  let end = -1;
  while (heap.size) {
    const [d, s] = heap.pop();
    if (d > dist[s]) continue;
    const cell = s >> 1;
    if (order[cell] < 0) order[cell] = settled++;
    if (cell === R * W - 1) {
      end = s;
      break;
    }
    const r = Math.floor(cell / W);
    const c = cell % W;
    const axis = s & 1;
    // turn: if last move was vertical (0) now move horizontally, and vice versa
    for (const k of axis === 0 ? [1, 3] : [0, 2]) {
      let cost = d;
      for (let n = 1; n <= maxRun; n++) {
        const nr = r + DIRS4[k][0] * n;
        const nc = c + DIRS4[k][1] * n;
        if (nr < 0 || nc < 0 || nr >= R || nc >= W) break;
        cost += heat[nr][nc];
        if (n < minRun) continue;
        const ns = (nr * W + nc) * 2 + (k === 1 || k === 3 ? 1 : 0);
        if (cost < dist[ns]) {
          dist[ns] = cost;
          prev[ns] = s;
          heap.push([cost, ns]);
        }
      }
    }
  }
  const path: number[] = [];
  for (let s = end; s >= 0; s = prev[s]) path.push(s >> 1);
  path.reverse();
  const loss = dist[end];
  const frames: Frame[] = [];
  const every = Math.max(1, Math.ceil(settled / 150));
  for (let k = 0; k <= settled; k += every)
    frames.push({ heat, order, settled: k, path, showPath: false, loss });
  frames.push({ heat, order, settled, path, showPath: true, loss });
  return { frames, answer: loss };
};
