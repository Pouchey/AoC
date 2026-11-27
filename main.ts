import { existsSync } from 'fs';
import { argv } from 'process';
import * as readline from 'readline';
import {
  createDataFile,
  createTodayFolder,
  dataFileExists,
  readInput,
  todayFolderExists
} from './utils/file';
import { resolveDayYear } from './utils/date';
import { getExample, getInput, submit } from './utils/aoc';
import { assertEqual } from './utils/assert';
import { log } from './utils/logger';
import { addProblemToFile, updateProblemCompletion } from './utils/web';

// Create the interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Help command
if (argv.includes('--help') || argv.includes('-h')) {
  log(
    "Usage:\nnpm start [day] [year]\nDefaults to today's puzzle during December (AoC time, UTC-5)."
  );
  process.exit();
}

const isSubmittable = (answer: unknown) =>
  (typeof answer === 'number' && Number.isFinite(answer) && answer !== 0) ||
  (typeof answer === 'bigint' && answer !== 0n) ||
  (typeof answer === 'string' && answer.trim() !== '');

const execute = async () => {
  let day: string;
  let year: string;
  let scriptPath: string;

  try {
    ({ day, year } = resolveDayYear(argv[2], argv[3]));
    scriptPath = `${year}/${day}`;

    if (!todayFolderExists(scriptPath)) {
      await createTodayFolder(scriptPath);
    }

    // Idempotent: also catches up if a previous run failed after creating the folder
    addProblemToFile(year, day);

    if (!dataFileExists(scriptPath, 'example')) {
      createDataFile(scriptPath, 'example', await getExample(year, day));
    }
    if (!dataFileExists(scriptPath, 'input')) {
      createDataFile(scriptPath, 'input', await getInput(year, day));
    }
  } catch (error) {
    if (error instanceof Error) log(error.message, 'error', 'red');
    else log('There was an error.', 'error', 'red');

    process.exit(1);
  }

  const exampleFile = readInput(`./${scriptPath}/data/example`);
  // Optional dedicated example for part 2, when the statement gives a different one
  const example2Path = `./${scriptPath}/data/example2`;
  const example2File = existsSync(example2Path) ? readInput(example2Path) : exampleFile;
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
  const exampleOutput = await solve(part === 2 ? example2File : exampleFile);
  const exampleEndTime = performance.now();
  const exampleSolveTime = exampleEndTime - exampleStartTime;
  const exampleTimeStr =
    exampleSolveTime >= 1000
      ? `${(exampleSolveTime / 1000).toFixed(2)}s`
      : `${exampleSolveTime.toFixed(2)}ms`;
  log(`Solved in: ${exampleTimeStr}\n`, 'info', 'magenta');
  if (!assertEqual(exampleOutput, exampleAnswer, `Example part ${part}`)) {
    process.exit(1);
  }

  log('Running solve:\n', 'info', 'cyan');
  // try solve on input
  const startTime = performance.now();
  const inputOutput = await solve(inputFile);
  const endTime = performance.now();
  const solveTime = endTime - startTime;
  const solveTimeStr =
    solveTime >= 1000 ? `${(solveTime / 1000).toFixed(2)}s` : `${solveTime.toFixed(2)}ms`;
  log(`Solved in: ${solveTimeStr}\n`, 'info', 'magenta');
  log(`Result is: `, 'log', 'green');
  log(`${inputOutput}\n`, 'log', 'magenta');

  log('=====================\n', 'info', 'yellow');

  if (!isSubmittable(inputOutput)) {
    log(
      `Result "${inputOutput}" doesn't look like a valid answer, not offering to submit.`,
      'warn',
      'yellow'
    );
    rl.close();
    return;
  }

  rl.question('Submit this answer? (y/n) ', async (answer) => {
    if (['y', 'Y'].includes(answer)) {
      log('Submitting...', 'info', 'blue');
      try {
        const success = await submit(year, day, inputOutput, part);
        if (success) {
          updateProblemCompletion(year, day, part);
        }
      } catch (error) {
        log(error instanceof Error ? error.message : 'Submission failed.', 'error', 'red');
      }
    } else {
      log('Not submitting.', 'info', 'blue');
    }
    log('=====================', 'info', 'yellow');

    rl.close();
  });
};

execute();
