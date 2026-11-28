import type { TraceFn } from '../../viz/types';

export interface Frame {
  step: string;
  hash: number;
  /** part 2: boxes after this step (only non-empty ones) */
  boxes: [number, [string, number][]][];
  total: number;
}

export const hash = (s: string) => [...s].reduce((h, ch) => ((h + ch.charCodeAt(0)) * 17) % 256, 0);

export const trace: TraceFn<Frame> = (input, part) => {
  const steps = input.replace(/\s/g, '').split(',');
  const boxes = new Map<number, Map<string, number>>();
  let total = 0;
  const frames = steps.map((step) => {
    if (part === 1) {
      total += hash(step);
      return { step, hash: hash(step), boxes: [], total };
    }
    const [label, focal] = step.split(/[=-]/);
    const box = hash(label);
    if (!boxes.has(box)) boxes.set(box, new Map());
    // Map keeps insertion order: replacing a lens keeps its slot
    if (step.includes('=')) boxes.get(box)!.set(label, Number(focal));
    else boxes.get(box)!.delete(label);
    total = 0;
    for (const [b, lenses] of boxes)
      [...lenses.values()].forEach((f, slot) => (total += (b + 1) * (slot + 1) * f));
    const snapshot = [...boxes]
      .filter(([, lenses]) => lenses.size)
      .sort((a, b) => a[0] - b[0])
      .map(([b, lenses]) => [b, [...lenses]] as [number, [string, number][]]);
    return { step, hash: box, boxes: snapshot, total };
  });
  return { frames, answer: total };
};
