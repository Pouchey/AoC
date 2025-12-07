import { argv } from 'process';
import * as readline from 'readline';
import {
  createDataFile,
  createTodayFolder,
  readInput,
  todayDataExists,
  todayFolderExists
} from './utils/file';
import { getExample, getInput, submit } from './utils/aoc';
import { assertEqual } from './utils/assert';
import { log } from './utils/logger';

// Create the interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Help command
if (argv.includes('--help') || argv.includes('-h')) {
  log('Usage:\nnode runner.js <day> <year>\nday and year defaults to current day and current year');
  process.exit();
}

const execute = async () => {
  const now = new Date();
  const day = (argv[2] || now.getDate()).toString().padStart(2, '0');
  const year = argv[3] || now.getFullYear().toString();

  const scriptPath = `${year}/${day}`;

  try {
    if (!todayFolderExists(scriptPath)) {
      await createTodayFolder(scriptPath);
    }

    if (!todayDataExists(scriptPath)) {
      const example = await getExample(year, day);
      const input = await getInput(year, day);
      createDataFile(scriptPath, 'example', example);
      createDataFile(scriptPath, 'input', input);
    }
  } catch (error) {
    if (error instanceof Error) log(error.message, 'error', 'red');
    else log('There was an error.', 'error', 'red');

    process.exit();
  }

  const exampleFile = readInput(`./${scriptPath}/data/example`);
  const inputFile = readInput(`./${scriptPath}/data/input`);

  log('=====================\n', 'info', 'yellow');
  log(`Running Advent of Code ${year} /${day}\n`, 'info', 'christmas');
  log('=====================\n', 'info', 'yellow');
  const script = await import(`./${scriptPath}`);

  const { solve1, solve2, exampleAnswer1, exampleAnswer2, firstPartCompleted } = script;

  const part = firstPartCompleted ? 2 : 1;
  const solve = firstPartCompleted ? solve2 : solve1;
  const exampleAnswer = firstPartCompleted ? exampleAnswer2 : exampleAnswer1;

  // try solve on example
  log(`Part ${part}:\n`, 'info', 'blue');
  log('Running example:\n', 'info', 'cyan');
  const exampleStartTime = performance.now();
  const exampleOutput = solve(exampleFile);
  const exampleEndTime = performance.now();
  const exampleSolveTime = exampleEndTime - exampleStartTime;
  log(`Solved in: ${exampleSolveTime.toFixed(2)}ms\n`, 'info', 'magenta');
  if (!assertEqual(exampleOutput, exampleAnswer)) {
    process.exit();
  }

  log('Running solve:\n', 'info', 'cyan');
  // try solve on input
  const startTime = performance.now();
  const inputOutput = solve(inputFile);
  const endTime = performance.now();
  const solveTime = endTime - startTime;
  log(`Solved in: ${solveTime.toFixed(2)}ms\n`, 'info', 'magenta');
  log(`Result is: `, 'log', 'green');
  log(`${inputOutput}\n`, 'log', 'magenta');

  log('=====================\n', 'info', 'yellow');

  rl.question('Submit this answer? (y/n) ', async (answer) => {
    if (['y', 'Y'].includes(answer)) {
      log('Submitting...', 'info', 'blue');
      await submit(year, day, inputOutput, part);
    } else {
      log('Not submitting.', 'info', 'blue');
    }
    log('=====================', 'info', 'yellow');

    rl.close();
  });
};

execute();
