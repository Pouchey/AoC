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

// Create the interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Help command
if (argv.includes('--help') || argv.includes('-h')) {
  console.log(
    'Usage:\nnode runner.js <day> <year>\nday and year defaults to current day and current year'
  );
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
    if (error instanceof Error) console.log(error.message);
    else console.log('There was an error.');

    process.exit();
  }

  const exampleFile = readInput(`./${scriptPath}/data/example`);
  const inputFile = readInput(`./${scriptPath}/data/input`);

  console.log('=====================\n');
  console.log(`Running Advent of Code 2023 /${day}\n`);
  console.log('=====================\n');
  const script = await import(`./${scriptPath}`);

  const { solve1, solve2, exampleAnswer1, exampleAnswer2, firstPartCompleted } = script;

  const part = firstPartCompleted ? 2 : 1;
  const solve = firstPartCompleted ? solve2 : solve1;
  const exampleAnswer = firstPartCompleted ? exampleAnswer2 : exampleAnswer1;

  // try solve on example
  console.log(`Part ${part}:\n`);
  console.log('Running example:\n');
  const exampleOutput = solve(exampleFile);
  if (!assertEqual(exampleOutput, exampleAnswer)) {
    process.exit();
  }

  console.log('Running solve:\n');
  // try solve on input
  console.time('Solved in');
  const inputOutput = solve(inputFile);
  console.timeEnd('Solved in');
  console.log(`Result is: ${inputOutput}`);
  console.log('=====================\n');

  rl.question('Submit this answer? (y/n) ', async (answer) => {
    if (['y', 'Y'].includes(answer)) {
      console.log('Submitting...');
      await submit(year, day, inputOutput, part);
    } else {
      console.log('Not submitting.');
    }
    console.log('=====================');

    rl.close();
  });
};

execute();
