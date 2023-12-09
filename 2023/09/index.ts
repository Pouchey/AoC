const loadData = (input: string) => {
  const lines = input.split('\n');

  return lines;
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const histories = data.map((line) => {
    const numbers = line.split(' ').map((n) => parseInt(n, 10));

    let history: number[][] = [numbers];
    let historyIndex = 0;

    do {
      history.push([]);
      historyIndex++;

      const last = history[historyIndex - 1];

      for (let i = 1; i < last.length; i++) {
        history[historyIndex].push(last[i] - last[i - 1]);
      }
    } while (!history[historyIndex].every((n) => n === 0));

    return history;
  });

  const predictions = histories.map((history) => {
    let res = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      const lastHist = history[i];
      const lastHistLength = lastHist.length;
      const lastHistItem = lastHist[lastHistLength - 1];
      res += lastHistItem;
    }
    return res;
  });

  const result = predictions.reduce((acc, cur) => acc + cur, 0);

  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const histories = data.map((line) => {
    const numbers = line.split(' ').map((n) => parseInt(n, 10));

    let history: number[][] = [numbers];
    let historyIndex = 0;

    do {
      history.push([]);
      historyIndex++;

      const last = history[historyIndex - 1];

      for (let i = 1; i < last.length; i++) {
        history[historyIndex].push(last[i] - last[i - 1]);
      }
    } while (!history[historyIndex].every((n) => n === 0));

    return history;
  });

  const predictions = histories.map((history) => {
    let res = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      const lastHist = history[i];
      const firstHistItem = lastHist[0];
      if (i === history.length - 2) res = firstHistItem;
      else res = firstHistItem - res;
    }
    return res;
  });

  const result = predictions.reduce((acc, cur) => acc + cur, 0);

  return result;
};

export const exampleAnswer1 = 114;
export const exampleAnswer2 = 2;

export const firstPartCompleted = true;
