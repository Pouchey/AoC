import { TGrid, parseLines } from '../../utils';

const loadData = (input: string) => {
  const data = parseLines(input);
  return data;
};

const calculate1 = (data: TGrid<string>) => {
  const partNumber = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];

      if (!isNaN(parseInt(cell, 10))) {
        const fullNumber = [cell];
        let count = 0;

        while (!isNaN(parseInt(row[j + 1], 10))) {
          fullNumber.push(row[j + 1]);
          count++;
          j++;
        }

        // look around the full number
        const left = j - count - 1 < 0 ? 0 : j - count - 1;
        const right = j + 1 > row.length - 1 ? row.length - 1 : j + 1;
        const top = i - 1 < 0 ? 0 : i - 1;
        const bottom = i + 1 > data.length - 1 ? data.length - 1 : i + 1;

        // look at the char around the full number
        for (let i2 = top; i2 <= bottom; i2++) {
          const row2 = data[i2];
          for (let j2 = left; j2 <= right; j2++) {
            const cell2 = row2[j2];
            if (isNaN(parseInt(cell2, 10)) && cell2 !== '.') {
              partNumber.push(fullNumber.join(''));
              break;
            }
          }
        }
      }
    }
  }

  const result = partNumber.reduce((acc, cur) => acc + parseInt(cur, 10), 0);

  return result;
};

interface FindFullNumberNeighbor {
  data: TGrid<string>;
  i: number;
  j: number;
}

const findFullNumberNeighbor = ({ data, i, j }: FindFullNumberNeighbor) => {
  const left = j - 1 < 0 ? 0 : j - 1;
  const right = j + 1 > data[i].length - 1 ? data[i].length - 1 : j + 1;
  const top = i - 1 < 0 ? 0 : i - 1;
  const bottom = i + 1 > data.length - 1 ? data.length - 1 : i + 1;

  const fullNumber = [];
  let numberIndex = 0;

  for (let i2 = top; i2 <= bottom; i2++) {
    const row2 = data[i2];
    for (let j2 = left; j2 <= right; j2++) {
      const cell2 = row2[j2];
      if (!isNaN(parseInt(cell2, 10))) {
        fullNumber[numberIndex] = cell2;
        let leftJ = j2;
        let rightJ = j2;
        // look left
        while (leftJ > 0 && !isNaN(parseInt(row2[leftJ - 1], 10))) {
          fullNumber[numberIndex] = row2[leftJ - 1].concat(fullNumber[numberIndex]);
          leftJ--;
        }
        // look right
        while (rightJ < row2.length && !isNaN(parseInt(row2[rightJ + 1], 10))) {
          fullNumber[numberIndex] = fullNumber[numberIndex].concat(row2[rightJ + 1]);
          rightJ++;
        }

        numberIndex++;
        j2 = rightJ;
      }
    }
  }

  return fullNumber;
};

const calculate2 = (data: TGrid<string>) => {
  const gearRatio = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      if (isNaN(parseInt(cell, 10)) && cell === '*') {
        const partNumbers = findFullNumberNeighbor({
          data,
          i,
          j
        });

        if (partNumbers.length === 2) {
          const result = parseInt(partNumbers[0], 10) * parseInt(partNumbers[1], 10);
          gearRatio.push(result);
        }
      }
    }
  }

  const result = gearRatio.reduce((acc, cur) => acc + cur, 0);

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
export const exampleAnswer1 = 4361;
export const exampleAnswer2 = 467835;

export const firstPartCompleted = true;
