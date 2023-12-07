type CardType = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

type HandsType =
  | 'Five of a Kind'
  | 'Four of a Kind'
  | 'Full House'
  | 'Three of a Kind'
  | 'Two pair'
  | 'One pair'
  | 'High Card';

type PlayerType = {
  cards: CardType[];
  bid: number;
};

type PlayerWithHandType = PlayerType & {
  hand: HandsType;
};

const HAND_LENGTH = 5;

const CARDS_INDEX = 'AKQJT98765432';
const CARDS_WITH_JOKER_INDEX = 'AKQT98765432J';

const HANDS_INDEX =
  'Five of a KindFour of a KindFull HouseThree of a KindTwo pairOne pairHigh Card';

const loadData = (input: string) => {
  const lines = input.split('\n');

  const data = lines.map((line) => {
    const [cards, bid] = line.split(' ');
    const typedCards = cards.split('').map((card) => card as CardType);
    const typedBid = +bid;
    return {
      cards: typedCards,
      bid: typedBid
    };
  });

  return data;
};

const sortCards = (cards: CardType[], joker = false) => {
  const cardsIndex = joker ? CARDS_WITH_JOKER_INDEX : CARDS_INDEX;
  const sorted = [...cards].sort((a, b) => {
    const aIndex = cardsIndex.indexOf(a);
    const bIndex = cardsIndex.indexOf(b);
    return aIndex - bIndex;
  });
  return sorted;
};

const isFiveOfAKind = (cards: CardType[], joker = false) => {
  const sorted = sortCards(cards, joker);
  const [first, ...rest] = sorted;
  const isFive = rest.every((card) => card === first || (joker && card === 'J'));
  return isFive;
};

const isFourOfAKind = (cards: CardType[], joker = false) => {
  const sorted = sortCards(cards, joker);
  if (sorted[0] === sorted[1] && sorted[1] === sorted[2] && sorted[2] === sorted[3]) return true;
  if (sorted[1] === sorted[2] && sorted[2] === sorted[3] && sorted[3] === sorted[4]) return true;

  if (joker) {
    const occurences = sorted.reduce(
      (acc, card) => {
        if (!acc[card]) {
          acc[card] = 0;
        }
        acc[card]++;
        return acc;
      },
      {} as Record<CardType, number>
    );

    if (
      Object.keys(occurences).includes('J') &&
      Object.values(occurences).length === 3 &&
      Object.keys(occurences).find((key) => {
        const value = occurences[key as CardType];
        const numberOfJokers = occurences['J'];
        return value + numberOfJokers === 4;
      })
    )
      return true;
  }

  return false;
};

const isFullHouse = (cards: CardType[], joker = false) => {
  const sorted = sortCards(cards, joker);
  if (sorted[0] === sorted[1] && sorted[2] === sorted[3] && sorted[3] === sorted[4]) {
    return true;
  }
  if (sorted[0] === sorted[1] && sorted[1] === sorted[2] && sorted[3] === sorted[4]) {
    return true;
  }
  if (joker) {
    const occurences = sorted.reduce(
      (acc, card) => {
        if (!acc[card]) {
          acc[card] = 0;
        }
        acc[card]++;
        return acc;
      },
      {} as Record<CardType, number>
    );

    if (Object.keys(occurences).includes('J') && Object.values(occurences).length === 3)
      return true;
  }
  return false;
};

const isThreeOfAKind = (cards: CardType[], joker = false) => {
  const sorted = sortCards(cards, joker);
  if (sorted[0] === sorted[1] && sorted[1] === sorted[2]) return true;
  if (sorted[1] === sorted[2] && sorted[2] === sorted[3]) return true;
  if (sorted[2] === sorted[3] && sorted[3] === sorted[4]) return true;

  if (joker) {
    const occurences = sorted.reduce(
      (acc, card) => {
        if (!acc[card]) {
          acc[card] = 0;
        }
        acc[card]++;
        return acc;
      },
      {} as Record<CardType, number>
    );

    if (
      Object.keys(occurences).includes('J') &&
      Object.keys(occurences).find((key) => {
        const value = occurences[key as CardType];
        const numberOfJokers = occurences['J'];
        return value + numberOfJokers === 3;
      })
    )
      return true;
  }
  return false;
};

const isTwoPair = (cards: CardType[], joker = false) => {
  const sorted = sortCards(cards, joker);
  const pairs = sorted.map((card, index) => {
    const rest = sorted.slice(index + 1);
    return rest.includes(card);
  });
  const hasPair = pairs.filter((pair) => pair).length;

  if (joker && sorted.includes('J')) {
    if (hasPair === 1) return true;
    return false;
  }

  return hasPair === 2;
};

const isOnePair = (cards: CardType[], joker = false) => {
  const sorted = sortCards(cards, joker);
  const pairs = sorted.map((card, index) => {
    const rest = sorted.slice(index + 1);
    return rest.includes(card);
  });
  const hasPair = pairs.filter((pair) => pair).length;

  if (joker && sorted.includes('J')) {
    if (hasPair === 0) return true;
    return false;
  }

  return hasPair === 1;
};

const attributeHands = (cards: CardType[], joker = false): HandsType => {
  if (isFiveOfAKind(cards, joker)) {
    return 'Five of a Kind';
  }
  if (isFourOfAKind(cards, joker)) {
    return 'Four of a Kind';
  }
  if (isFullHouse(cards, joker)) {
    return 'Full House';
  }
  if (isThreeOfAKind(cards, joker)) {
    return 'Three of a Kind';
  }
  if (isTwoPair(cards, joker)) {
    return 'Two pair';
  }
  if (isOnePair(cards, joker)) {
    return 'One pair';
  }
  return 'High Card';
};

const sortHands = (player: PlayerWithHandType[], joker = false) => {
  const cardsIndex = joker ? CARDS_WITH_JOKER_INDEX : CARDS_INDEX;

  const sorted = [...player].sort((a, b) => {
    const aIndex = HANDS_INDEX.indexOf(a.hand);
    const bIndex = HANDS_INDEX.indexOf(b.hand);
    if (aIndex !== bIndex) return bIndex - aIndex;

    let i = 0;
    do {
      const aCard = a.cards[i];
      const bCard = b.cards[i];
      const aCardIndex = cardsIndex.indexOf(aCard);
      const bCardIndex = cardsIndex.indexOf(bCard);
      if (aCardIndex !== bCardIndex) return bCardIndex - aCardIndex;
      i++;
    } while (i < HAND_LENGTH);

    return 0;
  });
  return sorted;
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const playersWithHand: PlayerWithHandType[] = data.map((player) => {
    const hand = attributeHands(player.cards);
    return {
      ...player,
      hand
    };
  });

  const sortedHands = sortHands(playersWithHand);

  const wins = sortedHands.map((player, index) => {
    const rank = index + 1;
    return player.bid * rank;
  });

  const result = wins.reduce((acc, win) => acc + win, 0);

  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const playersWithHand: PlayerWithHandType[] = data.map((player) => {
    const hand = attributeHands(player.cards, true);
    return {
      ...player,
      hand
    };
  });

  const sortedHands = sortHands(playersWithHand, true);

  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, 'data', 'output1.txt');
  const stream = fs.createWriteStream(filePath);
  sortedHands.forEach((player) => {
    stream.write(`${player.cards.join('')} ${player.bid}\n`);
  });

  const wins = sortedHands.map((player, index) => {
    const rank = index + 1;
    return player.bid * rank;
  });

  const result = wins.reduce((acc, win) => acc + win, 0);

  return result;
};

export const exampleAnswer1 = 6440;
export const exampleAnswer2 = 5905;

export const firstPartCompleted = true;
