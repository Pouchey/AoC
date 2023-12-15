type Colors = 'red' | 'green' | 'blue';

type Cubes = Map<Colors, number>;
type Game = {
  id: number;
  sets: Cubes[];
};

const loadData = (input: string): Game[] => {
  const lines = input.split('\n');

  const blocks = lines.map((line) => {
    const sep1 = line.split(':');
    const sep2 = sep1[1].split(';');
    const sep3 = sep2.map((s) => s.split(','));

    const gameNumber = sep1[0].split(' ')[1];
    const gameId = parseInt(gameNumber, 10);

    const sets = sep3.map((set) => {
      const cubes = new Map<Colors, number>();
      set.map((cube) => {
        const sep4 = cube.split(' ');
        cubes.set(sep4[2] as Colors, parseInt(sep4[1], 10));
      });
      return cubes;
    });

    return {
      id: gameId,
      sets: sets
    };
  });

  return blocks;
};

const calculate1 = (games: Game[], params: Cubes) => {
  const maxs = games.map((game) => {
    let redCount = 0;
    let blueCount = 0;
    let greenCount = 0;

    game.sets.forEach((set) => {
      const red = set.has('red') ? set.get('red')! : 0;
      const blue = set.has('blue') ? set.get('blue')! : 0;
      const green = set.has('green') ? set.get('green')! : 0;

      if (red > redCount) redCount = red;
      if (blue > blueCount) blueCount = blue;
      if (green > greenCount) greenCount = green;
    });

    const checksRed = redCount <= params.get('red')!;
    const checksBlue = blueCount <= params.get('blue')!;
    const checksGreen = greenCount <= params.get('green')!;

    return {
      id: game.id,
      counts: [checksRed, checksBlue, checksGreen]
    };
  });
  const results = maxs.reduce((acc, set) => {
    const isFull = set.counts.every((count) => count);

    if (isFull) return acc + set.id;
    return acc;
  }, 0);

  return results;
};

const calculate2 = (games: Game[]) => {
  const maxs = games.map((game) => {
    let redCount = 0;
    let blueCount = 0;
    let greenCount = 0;

    game.sets.forEach((set) => {
      const red = set.has('red') ? set.get('red')! : 0;
      const blue = set.has('blue') ? set.get('blue')! : 0;
      const green = set.has('green') ? set.get('green')! : 0;

      if (red > redCount) redCount = red;
      if (blue > blueCount) blueCount = blue;
      if (green > greenCount) greenCount = green;
    });

    return {
      id: game.id,
      counts: [redCount, blueCount, greenCount]
    };
  });
  const results = maxs.reduce((acc, set) => {
    const mult = set.counts.reduce((acc, count) => acc * count, 1);
    return acc + mult;
  }, 0);

  return results;
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const params: Cubes = new Map<Colors, number>();
  params.set('red', 12);
  params.set('green', 13);
  params.set('blue', 14);

  const result = calculate1(data, params);
  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input);
  const result = calculate2(data);
  return result;
};

export const exampleAnswer1 = 8;
export const exampleAnswer2 = 2286;

export const firstPartCompleted = true;
