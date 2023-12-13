import { sum } from '../../utils';

type TBlock = {
  rows: string[];
  cols: string[];
};

type TReflection = {
  index: number;
  foundSmudge: boolean;
};

const loadData = (input: string) => {
  const patterns = input.split('\n\n');

  const blocks: TBlock[] = [];

  let block: TBlock = {
    rows: [],
    cols: []
  };
  for (const pattern of patterns) {
    const lines = pattern.split('\n');
    block = {
      rows: [],
      cols: []
    };
    for (const line of lines) block.rows.push(line);
    blocks.push(block);
  }

  const ret = blocks.map((block) => {
    const rows = block.rows;
    let cols = [];
    for (let i = 0; i < rows[0].length; i++) {
      let col = '';
      for (let j = 0; j < rows.length; j++) {
        col += rows[j][i];
      }
      cols.push(col);
    }
    return {
      rows,
      cols
    };
  });

  return ret;
};

export const findSmudge = (line1: string, line2: string) => {
  const nbChars = line1.length;
  let nbSmudges = 0;
  for (let i = 0; i < nbChars; i++) {
    if (line1[i] !== line2[i]) nbSmudges++;
    if (nbSmudges > 1) return false;
  }
  return nbSmudges === 1;
};

export const findReflectionLine = (lines: string[], hasSmudge = false): TReflection | undefined => {
  const nbLines = lines.length;
  let foundSmudge = false;

  for (let i = 1; i <= nbLines - 1; i++) {
    let j = i - 1;
    let k = i;
    let reflect = true;
    while (j >= 0 && k <= nbLines - 1) {
      const isSmudge = hasSmudge && !foundSmudge && findSmudge(lines[j], lines[k]);
      if (isSmudge) foundSmudge = true;

      if (!isSmudge && lines[j] !== lines[k]) {
        reflect = false;
        foundSmudge = false;
        break;
      }

      j--;
      k++;
    }
    if (reflect) {
      if (hasSmudge && foundSmudge) return { index: i, foundSmudge };
      if (!hasSmudge) return { index: i, foundSmudge };
    }
  }
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const blocks = data.map((block) => {
    const rowsReflectionIndex = findReflectionLine(block.rows);

    if (rowsReflectionIndex) return 100 * rowsReflectionIndex.index;

    const colsReflectionIndex = findReflectionLine(block.cols);

    if (colsReflectionIndex) return colsReflectionIndex.index;

    throw new Error('No reflection line found');
  });

  const result = sum(blocks);

  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const blocks = data.map((block) => {
    const rowsReflectionIndex = findReflectionLine(block.rows, true);

    if (rowsReflectionIndex) return 100 * rowsReflectionIndex.index;

    const colsReflectionIndex = findReflectionLine(block.cols, true);

    if (colsReflectionIndex) return colsReflectionIndex.index;

    throw new Error('No reflection line found');
  });

  const result = sum(blocks);

  return result;
};

export const exampleAnswer1 = 405;
export const exampleAnswer2 = 400;

export const firstPartCompleted = true;
