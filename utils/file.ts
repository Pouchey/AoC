import fs from 'fs';

export const readInput = (filePath: string): string => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } catch (error) {
    console.error(`Error reading input file: ${error}`);
    return '';
  }
};
