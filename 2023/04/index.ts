type Data = string[];

const loadData = (input: string) => {
  const lines = input.split('\n');
  const data: Data = lines;

  return data;
};

const regex1 = /Card\s+(\d+):\s*((?:\s*\d+)+) \|\s*((?:\s*\d+)+)/g;

const calculate1 = (data: Data) => {
  const result = data.reduce((acc, cur) => {
    const matches = [...cur.matchAll(regex1)];
    const winNumbers = matches[0][2]
      .replace(/\s\s+/g, ' ')
      .split(' ')
      .map((n) => parseInt(n, 10));

    const ownedNumbers = matches[0][3]
      .replace(/\s\s+/g, ' ')
      .split(' ')
      .map((n) => parseInt(n, 10));

    const winnedNumbers = winNumbers.filter((n) => ownedNumbers.includes(n));

    if (winnedNumbers.length === 1) return acc + 1;
    if (winnedNumbers.length > 1) return acc + Math.pow(2, winnedNumbers.length - 1);

    return acc;
  }, 0);

  return result;
};

const calculate2 = (data: Data) => {
  const points = data.map((card) => {
    const matches = [...card.matchAll(regex1)];
    const winNumbers = matches[0][2]
      .replace(/\s\s+/g, ' ')
      .split(' ')
      .map((n) => parseInt(n, 10));

    const ownedNumbers = matches[0][3]
      .replace(/\s\s+/g, ' ')
      .split(' ')
      .map((n) => parseInt(n, 10));

    const winnedNumbers = ownedNumbers.filter((n) => winNumbers.includes(n));
    return winnedNumbers.length;
  });

  const cards: number[] = Array.from({ length: points.length }, () => 1);

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (point > 0)
      for (let j = 1; j <= point; ++j) {
        cards[i + j] += 1 * cards[i];
      }
  }

  const result = cards.reduce((acc, cur) => acc + cur, 0);

  return result;
};

export const solve1 = (input: string) => {
  const data = loadData(input);
  return calculate1(data);
};

export const solve2 = (input: string) => {
  const data = loadData(input);
  return calculate2(data);
};
export const exampleAnswer1 = 13;
export const exampleAnswer2 = 30;

export const firstPartCompleted = true;
