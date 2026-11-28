export type Part = 1 | 2;

/** Result of a day's simulation: the frames to animate and the final answer. */
export interface Trace<F> {
  frames: F[];
  answer: number | string;
}

export type TraceFn<F> = (input: string, part: Part) => Trace<F>;

export interface VizProps {
  year: number;
  day: number;
  part: Part;
}
