import dotenv from 'dotenv';
import { log } from './logger';
dotenv.config({ quiet: true });

const AOC_BASE_URL = 'https://adventofcode.com';

// AoC asks automated tools to identify themselves through the User-Agent header:
// https://www.reddit.com/r/adventofcode/wiki/faqs/automation
// Set AOC_USER_AGENT in .env to include your own contact (repo URL, email...).
const USER_AGENT = process.env.AOC_USER_AGENT || 'aoc-typescript-runner (personal AoC tooling)';

/**
 * fetch wrapper for adventofcode.com: adds the session cookie and User-Agent,
 * and turns non-200 responses into readable errors.
 */
export const aocFetch = async (path: string, init: RequestInit = {}): Promise<string> => {
  const cookie = process.env.AOC_SESSION_COOKIE;
  if (!cookie) {
    throw new Error('AOC_SESSION_COOKIE is missing. Add it to your .env file (see README).');
  }

  const url = `${AOC_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      cookie: `session=${cookie}`,
      'User-Agent': USER_AGENT,
      ...init.headers
    }
  });

  const body = await res.text();

  if (res.status === 400 || res.status === 401) {
    throw new Error(
      `Request to "${url}" was rejected (${res.status}): your AOC_SESSION_COOKIE is probably invalid or expired.`
    );
  }
  if (res.status === 404) {
    throw new Error(`"${url}" not found (404): the puzzle is probably not unlocked yet.`);
  }
  if (res.status !== 200) {
    throw new Error(`Fetching "${url}" failed with status ${res.status}:\n${body.slice(0, 500)}`);
  }

  return body;
};

export const getExample = async (year: string, day: string) => {
  const html = await aocFetch(`/${year}/day/${+day}`);

  // Heuristic: the example is usually the first <pre><code> block of the page.
  const match = html.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/);
  if (!match) {
    log(
      'No example block found on the puzzle page, example file left empty. Fill data/example manually.',
      'warn',
      'yellow'
    );
    return '';
  }

  return decodeHtmlEntities(match[1].replace(/<[^>]*>?/gm, '')).trim();
};

export const getInput = async (year: string, day: string) => {
  const input = await aocFetch(`/${year}/day/${+day}/input`);
  return input.trim();
};

const decodeHtmlEntities = (text: string) =>
  text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

export const getProblemDescription = async (
  year: string,
  day: string
): Promise<{ part1: string; part2: string | null }> => {
  const html = await aocFetch(`/${year}/day/${+day}`);

  // Extract article tags which contain the problem descriptions
  const articleMatches = html.matchAll(/<article class="day-desc">([\s\S]*?)<\/article>/g);
  const articles = Array.from(articleMatches);

  if (articles.length === 0) {
    throw new Error('No problem description found on the page');
  }

  // Convert HTML to markdown-like text
  const htmlToMarkdown = (htmlContent: string): string => {
    let text = htmlContent;

    // Convert headings
    text = text.replace(/<h2[^>]*>(.*?)<\/h2>/g, '--- $1 ---');

    // Convert code blocks
    text = text.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_, code) => {
      const cleanCode = code.replace(/<[^>]*>/g, '').trim();
      return cleanCode;
    });

    // Convert inline code
    text = text.replace(/<code>([^<]*)<\/code>/g, '`$1`');

    // Convert emphasis
    text = text.replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*');
    text = text.replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**');

    // Convert lists
    text = text.replace(/<ul[^>]*>/g, '');
    text = text.replace(/<\/ul>/g, '');
    text = text.replace(/<ol[^>]*>/g, '');
    text = text.replace(/<\/ol>/g, '');
    text = text.replace(/<li[^>]*>(.*?)<\/li>/g, '- $1');

    // Convert paragraphs
    text = text.replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n');

    // Remove all remaining HTML tags
    text = text.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    text = decodeHtmlEntities(text);

    // Clean up extra whitespace
    text = text
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim();

    return text;
  };

  const part1 = htmlToMarkdown(articles[0][1]);
  const part2 = articles.length > 1 ? htmlToMarkdown(articles[1][1]) : null;

  return { part1, part2 };
};

export const submit = async (
  year: string,
  day: string,
  answer: unknown,
  level: 1 | 2
): Promise<boolean> => {
  const body = new URLSearchParams({ level: String(level), answer: String(answer) }).toString();

  const response = await aocFetch(`/${year}/day/${+day}/answer`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body
  });

  if (response.includes('You gave an answer too recently')) {
    const match = response.match(/You have (.*?) left to wait/);

    if (!match) {
      log("You gave an answer too recently but the time couldn't be parsed.", 'error', 'christmas');
      return false;
    }

    const time = match[1];

    const matches = [...time.matchAll(/(?:(\d+)m )?(\d+)s/g)][0];
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
      return false;
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
    log('Correct answer!', 'log', 'christmas');
    return true;
  }

  log('Unrecognized response while submitting, logging raw response', 'error', 'red');
  log(response, 'error');

  return false;
};
