import memoize from '../../utils/memoize';

enum SpringState {
  DAMAGED = '#',
  OPERATIONAL = '.',
  UNKNOWN = '?'
}

type TGroup = [SpringState[], number[]];

const loadData = (input: string) => {
  const lines = input.split('\n');

  const groups: TGroup[] = lines.map((line) => {
    const [springs, records] = line.split(' ');

    const formattedSpring: SpringState[] = springs.split('').map((char) => {
      switch (char) {
        case '#':
          return SpringState.DAMAGED;
        case '.':
          return SpringState.OPERATIONAL;
        default:
          return SpringState.UNKNOWN;
      }
    });

    const formattedRecord = records.split(',').map((record) => +record);

    return [formattedSpring, formattedRecord];
  });

  return groups;
};

export const findArrangements = (
  springs: SpringState[],
  records: number[],
  count = 0
): string[] => {
  if (count > records[0]) return [];

  if (springs.length === 0 && records.length > 0 && records[0] !== count) return [];

  if (springs.length === 0) {
    return [''];
  }

  if (records.length > springs.length) return [];

  if (springs[0] === SpringState.OPERATIONAL) {
    if (count > 0) {
      if (records[0] === count)
        return findArrangements(springs.slice(1), records.slice(1)).map((arr) =>
          [SpringState.OPERATIONAL, ...arr].join('')
        );
      else return [];
    }

    return findArrangements(springs.slice(1), records).map((arr) =>
      [SpringState.OPERATIONAL, ...arr].join('')
    );
  }
  if (springs[0] === SpringState.DAMAGED) {
    if (springs.length === 1 && records.length !== 1 && records[0] !== count) return [];

    return findArrangements(springs.slice(1), records, count + 1).map((arr) =>
      [SpringState.DAMAGED, ...arr].join('')
    );
  }
  if (springs[0] === SpringState.UNKNOWN) {
    const newArr1 = [SpringState.OPERATIONAL, ...springs.slice(1)];
    const arr1 = findArrangements(newArr1, records, count);
    const newArr2 = [SpringState.DAMAGED, ...springs.slice(1)];
    const arr2 = findArrangements(newArr2, records, count);

    return [arr1, arr2].flat();
  }

  return [];
};

export const findArrangementsV2 = memoize((springs: string, records: number[]): number => {
  if (records.length === 0) return springs.includes(SpringState.DAMAGED) ? 0 : 1;
  if (springs.length === 0) return records.length === 0 ? 1 : 0;

  const spring = springs[0];

  if (spring === SpringState.OPERATIONAL) {
    return findArrangementsV2(springs.slice(1), records);
  }

  if (spring === SpringState.DAMAGED) {
    const rec = records[0];
    if (!rec) return 0;
    if (rec > springs.length) return 0;
    if (springs[rec] === SpringState.DAMAGED) return 0;
    if (springs.slice(0, rec).includes(SpringState.OPERATIONAL)) return 0;
    return findArrangementsV2(springs.slice(rec + 1), records.slice(1));
  }

  return (
    findArrangementsV2('.' + springs.slice(1), records) +
    findArrangementsV2('#' + springs.slice(1), records)
  );
});

export const solve1 = (input: string) => {
  const data = loadData(input);

  const arrangements = data.map(([springs, records]) =>
    findArrangementsV2(springs.join(''), records)
  );

  const result = arrangements.reduce((acc, curr) => acc + curr, 0);

  return result;
};

const FOLD_COPIES = 5;

const formatData = (data: TGroup[]): TGroup[] => {
  const formattedData = data.map(([springs, records]) => {
    const newSprings = [];
    for (let i = 0; i < FOLD_COPIES - 1; i++) {
      newSprings.push(...springs);
      newSprings.push(SpringState.UNKNOWN);
    }
    newSprings.push(...springs);

    const newRecords = [];
    for (let i = 0; i < FOLD_COPIES; i++) {
      newRecords.push(...records);
    }

    return [newSprings, newRecords] as TGroup;
  });

  return formattedData;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const formattedData = formatData(data);

  const arrangements = formattedData.map(([springs, records]) =>
    findArrangementsV2(springs.join(''), records)
  );

  const result = arrangements.reduce((acc, curr) => acc + curr, 0);

  return result;
};

export const exampleAnswer1 = 21;
export const exampleAnswer2 = 525152;

export const firstPartCompleted = true;
