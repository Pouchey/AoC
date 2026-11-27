/**
 * Regression test: every solution must still return its exampleAnswer on its example.
 * Usage: npm test [-- <year> [day]]   e.g. npm test, npm test -- 2025, npm test -- 2025 7
 * Env: AOC_TEST_TIMEOUT (seconds per day, default 90)
 * A solution can export `exampleTestSkip = { 2: 'reason' }` for parts whose example can't be checked.
 */
import { execFile } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { cpus } from 'os';
import { join } from 'path';

const TIMEOUT_MS = Number(process.env.AOC_TEST_TIMEOUT ?? 90) * 1000;
const [yearFilter, dayFilter] = process.argv.slice(2);

const days = readdirSync('.')
  .filter((y) => /^\d{4}$/.test(y) && (!yearFilter || y === yearFilter))
  .flatMap((y) => readdirSync(y).map((d) => join(y, d)))
  .filter((dir) => !dayFilter || dir.endsWith(`/${dayFilter.padStart(2, '0')}`))
  .filter((dir) => existsSync(join(dir, 'index.ts')) && existsSync(join(dir, 'data/example')))
  .sort();

type PartResult = {
  part: number;
  ok?: boolean;
  expected?: unknown;
  actual?: unknown;
  ms?: number;
  skipped?: string;
};

const checkDay = (dir: string) =>
  new Promise<{ dir: string; results?: PartResult[]; error?: string }>((done) => {
    execFile(
      process.execPath,
      ['--import', 'tsx', 'scripts/check-day.ts', dir],
      { timeout: TIMEOUT_MS, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          const reason = error.killed
            ? `timeout after ${TIMEOUT_MS / 1000}s`
            : stderr.trim().split('\n')[0];
          done({ dir, error: reason });
        } else {
          const line = stdout.split('\n').find((l) => l.startsWith('@@RESULT@@'));
          if (line) done({ dir, results: JSON.parse(line.slice('@@RESULT@@'.length)) });
          else done({ dir, error: 'no result printed' });
        }
      }
    );
  });

const main = async () => {
  if (days.length === 0) {
    console.error('No solution found for this filter.');
    process.exit(1);
  }

  const queue = [...days];
  const outcomes: Awaited<ReturnType<typeof checkDay>>[] = [];
  const worker = async () => {
    for (let dir = queue.shift(); dir; dir = queue.shift()) outcomes.push(await checkDay(dir));
  };
  await Promise.all(Array.from({ length: Math.max(1, cpus().length - 1) }, worker));

  let failures = 0;
  let skipped = 0;
  for (const { dir, results, error } of outcomes.sort((a, b) => a.dir.localeCompare(b.dir))) {
    if (error) {
      failures++;
      console.log(`✗ ${dir}  ${error}`);
      continue;
    }
    const line = results!
      .map((r) =>
        r.skipped
          ? `p${r.part} skip (${r.skipped})`
          : r.ok
            ? `p${r.part} ok ${r.ms!.toFixed(0)}ms`
            : `p${r.part} FAIL expected ${r.expected} got ${r.actual}`
      )
      .join(' | ');
    const ok = results!.every((r) => r.ok || r.skipped);
    skipped += results!.filter((r) => r.skipped).length;
    if (!ok) failures++;
    console.log(`${ok ? '✓' : '✗'} ${dir}  ${line}`);
  }

  console.log(
    `\n${days.length - failures}/${days.length} days pass${skipped ? `, ${skipped} part(s) skipped` : ''}`
  );
  process.exit(failures ? 1 : 0);
};

main();
