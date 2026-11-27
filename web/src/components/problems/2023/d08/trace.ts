import { blocks, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Frame {
  instructions: string;
  /** part 1: current node and step; part 2: cycle length of each ghost found so far */
  step: number;
  node: string;
  path: string[];
  ghosts: { start: string; cycle: number }[];
  lcm: number;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

export const trace: TraceFn<Frame> = (input, part) => {
  const [instructions, body] = blocks(input);
  const net = new Map<string, [string, string]>();
  for (const line of lines(body)) {
    const [name, l, r] = line.match(/\w+/g)!;
    net.set(name, [l, r]);
  }
  const walk = (
    start: string,
    end: (n: string) => boolean,
    onStep?: (n: string, s: number) => void
  ) => {
    let node = start;
    let step = 0;
    while (!end(node) || step === 0) {
      node = net.get(node)![instructions[step % instructions.length] === 'L' ? 0 : 1];
      step++;
      onStep?.(node, step);
      if (end(node)) break;
    }
    return step;
  };

  const frames: Frame[] = [];
  if (part === 1) {
    const path = ['AAA'];
    frames.push({ instructions, step: 0, node: 'AAA', path: ['AAA'], ghosts: [], lcm: 0 });
    const steps = walk(
      'AAA',
      (n) => n === 'ZZZ',
      (n) => path.push(n)
    );
    const every = Math.max(1, Math.floor(steps / 300));
    for (let s = 1; s <= steps; s++)
      if (s % every === 0 || s === steps)
        frames.push({
          instructions,
          step: s,
          node: path[s],
          path: path.slice(Math.max(0, s - 11), s + 1),
          ghosts: [],
          lcm: 0
        });
    return { frames, answer: steps };
  }

  // Part 2: every ghost loops on its own cycle; they all meet at the LCM
  const ghosts: Frame['ghosts'] = [];
  let lcm = 1;
  frames.push({ instructions, step: 0, node: '', path: [], ghosts: [], lcm: 1 });
  for (const start of [...net.keys()].filter((n) => n.endsWith('A'))) {
    const cycle = walk(start, (n) => n.endsWith('Z'));
    ghosts.push({ start, cycle });
    lcm = (lcm / gcd(lcm, cycle)) * cycle;
    frames.push({ instructions, step: cycle, node: start, path: [], ghosts: [...ghosts], lcm });
  }
  return { frames, answer: lcm };
};
