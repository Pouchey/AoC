import { readdir, readdirSync } from 'fs';
import * as readline from 'readline';

const SELECTED_YEAR = 2023;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the day: ', async (number) => {
  const scriptPath = `${SELECTED_YEAR}/${number}`;

  try {
    const script = await import(`./${scriptPath}`);

    console.log('=====================');
    console.log('');
    console.log(`Running Advent of Code 2023 /${number}`);
    console.log('');
    console.log('=====================');

    script.default();
  } catch (error) {
    console.log(error);
    const availableScipts = readdirSync(`${SELECTED_YEAR}`);
    const availableSciptsString = availableScipts.join(' \\ ');
    console.log('=====================');
    console.log('');
    console.log(`Advent of Code 2023 /${number} not found.`);
    console.log('');
    console.log('Available scripts:');
    console.log('');
    console.log(availableSciptsString);
    console.log('');
    console.log('=====================');
  } finally {
    rl.close();
  }
});
