import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { log } from './logger';

export interface Problem {
  year: number;
  day: number;
  title: string;
  part1Description?: string;
  part2Description?: string;
  exampleAnswer1?: unknown;
  exampleAnswer2?: unknown;
  firstPartCompleted: boolean;
  secondPartCompleted: boolean;
}

export interface ProblemsFile {
  years: { year: number; days: number[] }[];
  problems: Record<string, Problem>;
}

const PROBLEMS_FILE_PATH = resolve(__dirname, '../web/public/problems.json');

export const readProblemsFile = (): ProblemsFile => {
  if (!existsSync(PROBLEMS_FILE_PATH)) {
    return { years: [], problems: {} };
  }
  const content = readFileSync(PROBLEMS_FILE_PATH, 'utf8');
  console.log('Reading problems file:', content);
  return JSON.parse(content);
};

export const writeProblemsFile = (data: ProblemsFile): void => {
  writeFileSync(PROBLEMS_FILE_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
};

export const addProblemToFile = (year: string, day: string): void => {
  const data = readProblemsFile();
  const yearNum = parseInt(year);
  const dayNum = parseInt(day);
  const key = `${year}-${day}`;

  // Add year if not exists
  let yearEntry = data.years.find((y) => y.year === yearNum);
  if (!yearEntry) {
    yearEntry = { year: yearNum, days: [] };
    data.years.push(yearEntry);
    // Sort years descending
    data.years.sort((a, b) => b.year - a.year);
  }

  // Add day if not exists
  if (!yearEntry.days.includes(dayNum)) {
    yearEntry.days.push(dayNum);
    yearEntry.days.sort((a, b) => a - b);
  }

  // Add problem entry if not exists
  if (!data.problems[key]) {
    data.problems[key] = {
      year: yearNum,
      day: dayNum,
      title: `Day ${dayNum}`,
      firstPartCompleted: false,
      secondPartCompleted: false
    };
    log(`Added problem ${key} to problems.json`, 'info', 'green');
  }

  writeProblemsFile(data);
};

export const updateProblemCompletion = (year: string, day: string, part: 1 | 2): void => {
  const data = readProblemsFile();
  const key = `${year}-${day}`;

  if (data.problems[key]) {
    if (part === 1) {
      data.problems[key].firstPartCompleted = true;
    } else if (part === 2) {
      data.problems[key].secondPartCompleted = true;
    }
    writeProblemsFile(data);
    log(`Updated problem ${key} - part ${part} completed`, 'info', 'green');
  }
};
