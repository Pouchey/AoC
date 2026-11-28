import { ints, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export type Rect = [number, number, number, number]; // minX, minY, maxX, maxY

export interface Frame {
  tiles: [number, number][];
  candidate?: Rect;
  ok?: boolean;
  best?: Rect;
  bestArea: number;
  checked: number;
}

const area = ([a, b, c, d]: Rect) => (c - a + 1) * (d - b + 1);

/** The red tiles form a rectilinear loop; a rectangle is valid if no edge cuts through it and it is inside. */
const insideLoop = (tiles: [number, number][], [x0, y0, x1, y1]: Rect) => {
  const n = tiles.length;
  for (let i = 0; i < n; i++) {
    const [ax, ay] = tiles[i];
    const [bx, by] = tiles[(i + 1) % n];
    if (ax === bx) {
      if (ax > x0 && ax < x1 && Math.max(ay, by) > y0 && Math.min(ay, by) < y1) return false;
    } else if (ay > y0 && ay < y1 && Math.max(ax, bx) > x0 && Math.min(ax, bx) < x1) return false;
  }
  // Point-in-polygon for the rectangle center (ray to +x)
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  let inside = false;
  for (let i = 0; i < n; i++) {
    const [ax, ay] = tiles[i];
    const [bx, by] = tiles[(i + 1) % n];
    if (ax === bx && ax > cx && cy > Math.min(ay, by) && cy < Math.max(ay, by)) inside = !inside;
    if (ax === bx && ax === cx && cy >= Math.min(ay, by) && cy <= Math.max(ay, by)) return true;
    if (ay === by && ay === cy && cx >= Math.min(ax, bx) && cx <= Math.max(ax, bx)) return true;
  }
  return inside;
};

export const trace: TraceFn<Frame> = (input, part) => {
  const tiles = lines(input).map((l) => ints(l) as [number, number]);
  const rects: Rect[] = [];
  for (let i = 0; i < tiles.length; i++)
    for (let j = i + 1; j < tiles.length; j++) {
      const [a, b] = tiles[i];
      const [c, d] = tiles[j];
      rects.push([Math.min(a, c), Math.min(b, d), Math.max(a, c), Math.max(b, d)]);
    }
  const frames: Frame[] = [{ tiles, bestArea: 0, checked: 0 }];

  if (part === 1) {
    let best: Rect | undefined;
    const every = Math.max(1, Math.floor(rects.length / 200));
    rects.forEach((rect, k) => {
      const improved = !best || area(rect) > area(best);
      if (improved) best = rect;
      if (improved || k % every === 0)
        frames.push({
          tiles,
          candidate: rect,
          ok: improved,
          best,
          bestArea: area(best!),
          checked: k + 1
        });
    });
    return { frames, answer: area(best!) };
  }

  // Part 2: largest first, stop at the first rectangle fully inside the loop
  rects.sort((p, q) => area(q) - area(p));
  let checked = 0;
  for (const rect of rects) {
    checked++;
    const ok = insideLoop(tiles, rect);
    if (ok || checked % Math.max(1, Math.floor(rects.length / 300)) === 0 || checked < 40)
      frames.push({
        tiles,
        candidate: rect,
        ok,
        best: ok ? rect : undefined,
        bestArea: ok ? area(rect) : 0,
        checked
      });
    if (ok) return { frames, answer: area(rect) };
  }
  return { frames, answer: 0 };
};
