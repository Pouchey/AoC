import dotenv from 'dotenv';
import { log } from './logger';
dotenv.config();

export const getExample = async (year: string, day: string) => {
  const url = `https://adventofcode.com/${year}/day/${+day}`;
  const res = await fetch(url, {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_COOKIE}`
    }
  });
  if (res.status !== 200)
    throw new Error(`Fetching "${url}" failed with status ${res.status}:\n${await res.text()}`);

  const html = await res.text();

  const code = html.split('<pre><code>')[1].split('</code></pre>')[0];

  const input = code.replace(/<[^>]*>?/gm, '').trim();

  return input;
};

export const getInput = async (year: string, day: string) => {
  const url = `https://adventofcode.com/${year}/day/${+day}/input`;
  const res = await fetch(url, {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_COOKIE}`
    }
  });
  if (res.status !== 200)
    throw new Error(`Fetching "${url}" failed with status ${res.status}:\n${await res.text()}`);

  const input = (await res.text()).trim();
  return input;
};

export const submit = async (
  year: string,
  day: string,
  answer: unknown,
  level: 1 | 2
): Promise<boolean> => {
  const url = `https://adventofcode.com/${year}/day/${+day}/answer`;
  const body = `level=${level}&answer=${answer}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      cookie: `session=${process.env.AOC_SESSION_COOKIE}`,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (res.status !== 200)
    throw new Error(`Fetching "${url}" failed with status ${res.status}:\n${await res.text()}`);

  const response = await res.text();

  if (response.includes('You gave an answer too recently')) {
    const match = response.match(/You have (.*?) left to wait/);

    if (!match) {
      log("You gave an answer too recently but the time couldn't be parsed.", 'error', 'christmas');
      return false;
    }

    const time = match[1];

    const matches = [...time.matchAll(/(?:(\d+)m )?(\d+)s/)][0];
    const min = matches[1] || 0;
    const sec = matches[2];
    const total = ~~min * 60 + ~~sec;

    for (let seconds = total; seconds > 0; seconds--) {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(
        `You gave an answer too recently, waiting ${time} (${seconds}s remaining) before submitting.`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    log('');
    return submit(year, day, answer, level);
  }

  if (response.includes('not the right answer')) {
    if (response.includes('too high')) {
      log('Answer is too high', 'error', 'christmas');
      return false;
    } else if (response.includes('too low')) {
      log('Answer is too low', 'error', 'christmas');
      return true;
    } else {
      log('Answer not correct', 'error', 'christmas');
      return false;
    }
  }

  if (response.includes('Did you already complete it')) {
    log('Already completed', 'error', 'christmas');
    return true;
  }

  if (response.includes("That's the right answer!")) {
    return true;
  }

  log('Urecognized response while submitting, logging raw response', 'error', 'red');
  log(response, 'error');

  return false;
};
