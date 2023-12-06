type Data = number[][];

const timeRegex = /.:(.*)/g;

const loadData = (input: string, merged = false) => {
  const lines = input.split('\n');
  const data: Data = [];
  console.log(lines);
  lines.forEach((line) => {
    const row = [...line.matchAll(timeRegex)][0][1]
      .trim()
      .split(/\s+/)
      .map((item) => +item);
    data.push(row);
  });

  if (merged) {
    const res = data.map((row) => row.map((item) => item.toString()).join(''));
    return res.map((row) => [+row]);
  }

  return data;
};

export const solve1 = (input: string) => {
  const data = loadData(input);
  const [time, distance] = data;
  const wins = time.map((row, index) => {
    const speeds = Array.from({ length: row }, (_, i) => i);
    const distanceForEachSpeed = speeds.map((speed, ind) => speed * (row - ind));

    const numberOfWins = distanceForEachSpeed.filter((dist) => dist > distance[index]).length;
    return numberOfWins;
  });
  const result = wins.reduce((acc, win) => acc * win, 1);

  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input, true);

  const [time, distance] = data;
  const wins = time.map((row, index) => {
    const speeds = Array.from({ length: row }, (_, i) => i);
    const distanceForEachSpeed = speeds.map((speed, ind) => speed * (row - ind));

    const numberOfWins = distanceForEachSpeed.filter((dist) => dist > distance[index]).length;
    return numberOfWins;
  });
  const result = wins.reduce((acc, win) => acc * win, 1);

  return result;
};

export const exampleAnswer1 = 288;
export const exampleAnswer2 = 71503;

export const firstPartCompleted = true;
