import { argv } from 'process';
import { getProblemDescription } from './utils/aoc';
import { createMarkdownFile, todayFolderExists } from './utils/file';
import { log } from './utils/logger';
import { resolveDayYear } from './utils/date';

// Help command
if (argv.includes('--help') || argv.includes('-h')) {
  log(
    'Usage:\nnpm run get-subject <day> <year>\nday and year defaults to current day and current year'
  );
  process.exit();
}

const execute = async () => {
  try {
    const { day, year } = resolveDayYear(argv[2], argv[3]);
    const scriptPath = `${year}/${day}`;

    if (!todayFolderExists(scriptPath)) {
      log(`Folder ${scriptPath} does not exist. Please create it first.`, 'error', 'red');
      process.exit(1);
    }

    log(`Fetching problem description for ${year} day ${day}...`, 'info', 'blue');
    const { part1, part2 } = await getProblemDescription(year, day);

    log('Saving Part1.md...', 'info', 'blue');
    createMarkdownFile(scriptPath, 'Part1.md', part1);

    if (part2) {
      log('Saving Part2.md...', 'info', 'blue');
      createMarkdownFile(scriptPath, 'Part2.md', part2);
    } else {
      log('Part 2 not available yet (may need to complete Part 1 first)', 'warn', 'yellow');
    }

    log('Done!', 'log', 'green');
  } catch (error) {
    if (error instanceof Error) {
      log(error.message, 'error', 'red');
    } else {
      log('There was an error.', 'error', 'red');
    }
    process.exit(1);
  }
};

execute();
