import { lines } from '../../viz/lib';
import type { TraceFn } from '../../viz/types';

export const TYPES = [
  'High card',
  'One pair',
  'Two pair',
  'Three of a kind',
  'Full house',
  'Four of a kind',
  'Five of a kind'
];

export interface Hand {
  cards: string;
  bid: number;
  type: number;
}

export interface Frame {
  /** hands sorted from weakest (rank 1) to strongest (shared) */
  ranked: Hand[];
  rank: number;
  total: number;
}

const typeOf = (cards: string, jokers: boolean) => {
  const counts = new Map<string, number>();
  for (const c of cards) counts.set(c, (counts.get(c) ?? 0) + 1);
  const j = jokers ? (counts.get('J') ?? 0) : 0;
  if (jokers) counts.delete('J');
  const sizes = [...counts.values()].sort((a, b) => b - a);
  sizes[0] = (sizes[0] ?? 0) + j; // jokers join the biggest group
  const [a, b = 0] = sizes;
  return a === 5 ? 6 : a === 4 ? 5 : a === 3 ? (b === 2 ? 4 : 3) : a === 2 ? (b === 2 ? 2 : 1) : 0;
};

export const trace: TraceFn<Frame> = (input, part) => {
  const order = part === 1 ? '23456789TJQKA' : 'J23456789TQKA';
  const hands = lines(input).map((line) => {
    const [cards, bid] = line.split(' ');
    return { cards, bid: Number(bid), type: typeOf(cards, part === 2) };
  });
  const ranked = [...hands].sort((a, b) => {
    if (a.type !== b.type) return a.type - b.type;
    for (let i = 0; i < 5; i++) {
      const d = order.indexOf(a.cards[i]) - order.indexOf(b.cards[i]);
      if (d) return d;
    }
    return 0;
  });
  let total = 0;
  const frames = ranked.map((hand, i) => {
    total += hand.bid * (i + 1);
    return { ranked, rank: i + 1, total };
  });
  return { frames, answer: total };
};
