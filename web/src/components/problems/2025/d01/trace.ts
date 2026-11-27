import { lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Frame {
  from: number;
  pos: number;
  move: string;
  /** clicks through 0 during this rotation (part 2) or landing on 0 (part 1) */
  hits: number;
  count: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  let pos = 50;
  let count = 0;
  const frames: Frame[] = [{ from: 50, pos, move: 'start', hits: 0, count }];
  for (const move of lines(input)) {
    const dir = move[0] === 'L' ? -1 : 1;
    const dist = Number(move.slice(1));
    const from = pos;
    let hits = 0;
    if (part === 2) {
      // clicks landing on 0: first after (from || 100) clicks going left, (100 - from) going right
      const first = dir < 0 ? from || 100 : 100 - from;
      if (dist >= first) hits = 1 + Math.floor((dist - first) / 100);
    }
    pos = (((pos + dir * dist) % 100) + 100) % 100;
    if (part === 1 && pos === 0) hits = 1;
    count += hits;
    frames.push({ from, pos, move, hits, count });
  }
  return { frames, answer: count };
};
