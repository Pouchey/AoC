import { lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export type RGB = { red: number; green: number; blue: number };
export const LIMIT: RGB = { red: 12, green: 13, blue: 14 };

export interface Frame {
  id: number;
  draws: RGB[];
  max: RGB;
  possible: boolean;
  power: number;
  total: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  let total = 0;
  const frames = lines(input).map((line) => {
    const [head, body] = line.split(':');
    const id = Number(head.replace(/\D/g, ''));
    const draws = body.split(';').map((draw) => {
      const rgb: RGB = { red: 0, green: 0, blue: 0 };
      for (const [, n, color] of draw.matchAll(/(\d+) (red|green|blue)/g))
        rgb[color as keyof RGB] = Number(n);
      return rgb;
    });
    const max = {
      red: Math.max(...draws.map((d) => d.red)),
      green: Math.max(...draws.map((d) => d.green)),
      blue: Math.max(...draws.map((d) => d.blue))
    };
    const possible = max.red <= LIMIT.red && max.green <= LIMIT.green && max.blue <= LIMIT.blue;
    const power = max.red * max.green * max.blue;
    total += part === 1 ? (possible ? id : 0) : power;
    return { id, draws, max, possible, power, total };
  });
  return { frames, answer: total };
};
