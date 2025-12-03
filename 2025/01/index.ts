const loadData = (input: string): string[] => {
  const lines = input.split('\n');
  return lines.filter((line) => line.trim().length > 0);
};

const calculate1 = (rotations: string[]): number => {
  // Start at position 50
  let position = 50;
  let count = 0;

  for (const line of rotations) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      continue;
    }

    // Parse rotation: L or R followed by a number
    const direction = trimmedLine[0];
    const distance = parseInt(trimmedLine.substring(1), 10);

    // Apply rotation
    if (direction === 'L') {
      // Left rotation: subtract distance (handle negative with +100)
      position = (position - distance + 100) % 100;
    } else if (direction === 'R') {
      // Right rotation: add distance
      position = (position + distance) % 100;
    } else {
      throw new Error(`Invalid direction: ${direction}`);
    }

    // Check if dial points at 0
    if (position === 0) {
      count++;
    }
  }

  return count;
};

const calculate2 = (rotations: string[]): number => {
  // Start at position 50
  let position = 50;
  let count = 0;

  for (const line of rotations) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      continue;
    }

    // Parse rotation: L or R followed by a number
    const direction = trimmedLine[0];
    const distance = parseInt(trimmedLine.substring(1), 10);

    const startPosition = position;

    // Apply rotation and count every time we pass through 0
    // We check positions AFTER each click (not including the starting position)
    if (direction === 'L') {
      // Left rotation: subtract distance
      // Check positions after each click: startPosition-1, startPosition-2, ..., startPosition-distance
      for (let i = 1; i <= distance; i++) {
        const currentPos = (startPosition - i + 100) % 100;
        if (currentPos === 0) {
          count++;
        }
      }
      position = (position - distance + 100) % 100;
    } else if (direction === 'R') {
      // Right rotation: add distance
      // Check positions after each click: startPosition+1, startPosition+2, ..., startPosition+distance
      for (let i = 1; i <= distance; i++) {
        const currentPos = (startPosition + i) % 100;
        if (currentPos === 0) {
          count++;
        }
      }
      position = (position + distance) % 100;
    } else {
      throw new Error(`Invalid direction: ${direction}`);
    }
  }

  return count;
};

export const solve1 = (input: string) => {
  const data = loadData(input);
  return calculate1(data);
};

export const solve2 = (input: string) => {
  const data = loadData(input);
  return calculate2(data);
};

export const exampleAnswer1 = 3;
export const exampleAnswer2 = 6;

export const firstPartCompleted = true;
