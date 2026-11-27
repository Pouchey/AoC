import { ints, lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export interface Card {
  winning: number[];
  have: number[];
  matches: number;
}

export interface Frame {
  cards: Card[];
  index: number;
  /** part 2: copies of each card after processing card `index` */
  copies: number[];
  total: number;
}

export const trace: TraceFn<Frame> = (input, part) => {
  const cards = lines(input).map((line) => {
    const [win, have] = line.split(':')[1].split('|').map(ints);
    return { winning: win, have, matches: have.filter((n) => win.includes(n)).length };
  });
  const copies = cards.map(() => 1);
  let total = 0;
  const frames = cards.map((card, index) => {
    if (part === 1) total += card.matches ? 2 ** (card.matches - 1) : 0;
    else {
      for (let k = 1; k <= card.matches && index + k < cards.length; k++)
        copies[index + k] += copies[index];
      total += copies[index];
    }
    return { cards, index, copies: [...copies], total };
  });
  return { frames, answer: total };
};
