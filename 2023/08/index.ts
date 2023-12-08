import { findLCMs } from '../../utils/math';

const loadData = (input: string) => {
  const lines = input.split('\n');

  const [firstLine, ...rest] = lines.filter((line) => line.length > 0);

  const steps = new Map<string, string[]>();
  for (const line of rest) {
    const [step, dirs] = line.split(' =');
    const [left, right] = dirs.replace(/[()]|\s*/g, '').split(',');
    steps.set(step, [left, right]);
  }

  const data = {
    instructions: firstLine.split('').map((c) => {
      if (c === 'R') return 1;
      if (c === 'L') return 0;

      throw new Error('Invalid instruction');
    }),
    steps
  };

  return data;
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  let current = 'AAA';
  let isZZZ = false;

  let instrIndex = 0;
  let loop = 0;

  do {
    const instr = data.instructions[instrIndex];
    const dirs = data.steps.get(current)!;
    current = dirs[instr];

    if (current === 'ZZZ') {
      isZZZ = true;
    }

    instrIndex++;
    if (instrIndex === data.instructions.length) {
      instrIndex = 0;
      loop++;
    }
  } while (!isZZZ);

  const result = loop * data.instructions.length + instrIndex;

  return result;
};

export const solve2fat = (input: string) => {
  const data = loadData(input);

  const instrLength = data.instructions.length;

  const starts = [...data.steps.keys()].filter((key) => key.endsWith('A'));

  let ends = [];

  let index = 0;
  let loop = 0;

  let currents = [...starts];

  do {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`try : ${loop * instrLength + index}`);
    ends = starts.map(() => false);

    const instr = data.instructions[index];

    const newPaths = currents.map((start, ind) => {
      const dirs = data.steps.get(start)!;
      if (dirs[instr].endsWith('Z')) {
        ends[ind] = true;
      }
      return dirs[instr];
    });

    currents = [...newPaths];

    index++;

    if (index === data.instructions.length) {
      index = 0;
      loop++;
    }
  } while (!ends.every((end) => end));
  const result = loop * instrLength + index;

  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const instrLength = data.instructions.length;

  const starts = [...data.steps.keys()].filter((key) => key.endsWith('A'));

  // find cycle in each path
  const cycles = starts.map((start) => {
    let visited = new Set<string>();
    let current = start;
    let index = 0;
    let loop = 0;
    do {
      const instr = data.instructions[index];
      if (visited.has(current)) return loop * instrLength + index - visited.size;
      const next = data.steps.get(current)![instr];

      if (current.endsWith('Z')) visited.add(next);

      current = next;
      index++;

      if (index === data.instructions.length) {
        index = 0;
        loop++;
      }
    } while (loop * instrLength + index < 1e6);

    throw new Error('No cycle found');
  });

  return findLCMs(cycles);
};

export const exampleAnswer1 = 2;
export const exampleAnswer2 = 6;

export const firstPartCompleted = true;
