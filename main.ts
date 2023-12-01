import * as readline from 'readline';
import * as child_process from 'child_process';

const SELECTED_YEAR = 2023;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the day: ', (number) => {
  const scriptPath = `${SELECTED_YEAR}/${number}/index.ts`;
  const child = child_process.spawn('node', [scriptPath]);

  child.stdout.on('data', (data) => {
    console.log(`Output: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
    rl.close();
  });
});
