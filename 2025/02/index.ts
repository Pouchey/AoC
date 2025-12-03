const loadData = (input: string) => {
  // Input is a single line with ranges separated by commas
  const line = input.trim().replace(/\n/g, '');
  const ranges = line.split(',').map((range) => {
    const [start, end] = range.split('-').map(Number);
    return { start, end };
  });
  return ranges;
};

const isInvalidIdPart1 = (id: number): boolean => {
  const idStr = id.toString();
  const len = idStr.length;

  // Must have even length to be split into two equal halves
  if (len % 2 !== 0) {
    return false;
  }

  const halfLen = len / 2;
  const firstHalf = idStr.substring(0, halfLen);
  const secondHalf = idStr.substring(halfLen);

  // Check if both halves are equal
  return firstHalf === secondHalf;
};

const isInvalidIdPart2 = (id: number): boolean => {
  const idStr = id.toString();
  const len = idStr.length;

  // Try different pattern lengths from 1 to half the length
  // Pattern must repeat at least twice, so max pattern length is len/2
  for (let patternLen = 1; patternLen <= Math.floor(len / 2); patternLen++) {
    // Check if the length is divisible by pattern length
    if (len % patternLen !== 0) {
      continue;
    }

    const pattern = idStr.substring(0, patternLen);
    const repetitions = len / patternLen;

    // Must repeat at least twice
    if (repetitions < 2) {
      continue;
    }

    // Check if the pattern repeats throughout the entire ID
    let isValidPattern = true;
    for (let i = 1; i < repetitions; i++) {
      const startIdx = i * patternLen;
      const segment = idStr.substring(startIdx, startIdx + patternLen);
      if (segment !== pattern) {
        isValidPattern = false;
        break;
      }
    }

    if (isValidPattern) {
      return true;
    }
  }

  return false;
};

export const solve1 = (input: string) => {
  const ranges = loadData(input);
  let sum = 0;

  for (const range of ranges) {
    for (let id = range.start; id <= range.end; id++) {
      if (isInvalidIdPart1(id)) {
        sum += id;
      }
    }
  }

  return sum;
};

export const solve2 = (input: string) => {
  const ranges = loadData(input);
  let sum = 0;

  for (const range of ranges) {
    for (let id = range.start; id <= range.end; id++) {
      if (isInvalidIdPart2(id)) {
        sum += id;
      }
    }
  }

  return sum;
};

export const exampleAnswer1 = 1227775554;
export const exampleAnswer2 = 4174379265;

export const firstPartCompleted = true;
