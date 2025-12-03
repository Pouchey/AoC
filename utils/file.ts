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
import { log } from './logger';

export const readInput = (filePath: string): string => {
  try {
    const data = readFileSync(filePath, 'utf8');
    return data;
  } catch (error) {
    log(`Error reading input file: ${error}`, 'error', 'red');
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
    log(`Couldn't find files in ${scriptPath}.`, 'warn', 'yellow');

    const folderPath = resolve(`./${scriptPath}`);
    const templatePath = resolve('./template');

    log('Creating folder...', 'info', 'blue');
    if (!existsSync(folderPath)) mkdirSync(folderPath);

    log('Copying template to script path...', 'info', 'blue');
    if (!existsSync(`${folderPath}/index.ts`))
      copyFileSync(`${templatePath}/index.ts`, `${folderPath}/index.ts`);

    const dataPath = resolve(`./${scriptPath}/data`);
    log('Creating data folder...', 'info', 'blue');
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
    log('Creating data file...', 'info', 'blue');
    writeFileSync(dataPath, data, 'utf8');
  }
};

export const createMarkdownFile = (scriptPath: string, filename: string, content: string) => {
  const filePath = resolve(`./${scriptPath}/${filename}`);
  writeFileSync(filePath, content, 'utf8');
  log(`Created ${filename}`, 'info', 'green');
};
