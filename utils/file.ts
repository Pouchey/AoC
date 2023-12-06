import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync
} from 'fs';
import { resolve } from 'path';

export const readInput = (filePath: string): string => {
  try {
    const data = readFileSync(filePath, 'utf8');
    return data;
  } catch (error) {
    console.error(`Error reading input file: ${error}`);
    return '';
  }
};

export const todayFolderExists = (scriptPath: string) => {
  const folderPath = resolve(`./${scriptPath}`);
  return existsSync(folderPath) && lstatSync(folderPath).isDirectory();
};

export const todayDataExists = (scriptPath: string) => {
  const dataPath = resolve(`./${scriptPath}/data`);
  const files = readdirSync(dataPath);
  return files.length === 2;
};

export const createTodayFolder = async (scriptPath: string) => {
  if (!todayFolderExists(scriptPath)) {
    console.log(`Couldn't find files in ${scriptPath}.`);

    const folderPath = resolve(`./${scriptPath}`);
    const templatePath = resolve('./2023/00');

    console.log('Creating folder...');
    if (!existsSync(folderPath)) mkdirSync(folderPath);

    console.log('Copying template to script path...');
    if (!existsSync(`${folderPath}/index.ts`))
      copyFileSync(`${templatePath}/index.ts`, `${folderPath}/index.ts`);

    const dataPath = resolve(`./${scriptPath}/data`);
    console.log('Creating data folder...');
    if (!existsSync(dataPath)) mkdirSync(dataPath);
  }
};

export const createDataFile = async (
  scriptPath: string,
  type: 'input' | 'example',
  data: string
) => {
  const dataPath = resolve(`./${scriptPath}/data/${type}`);
  if (!existsSync(dataPath)) {
    console.log('Creating data file...');
    writeFileSync(dataPath, data, 'utf8');
  }
};
