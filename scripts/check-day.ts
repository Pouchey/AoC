/**
 * Runs one day's solution on its example(s) and prints a JSON result line.
 * Spawned by test-examples.ts so a slow or stuck solution can be killed.
 * Usage: tsx scripts/check-day.ts <YYYY/DD>
 */
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

type PartResult =
  | { part: 1 | 2; ok: boolean; expected: unknown; actual: unknown; ms: number }
  | { part: 1 | 2; skipped: string };

const run = async () => {
  const dir = resolve(process.argv[2]);
  const mod = await import(resolve(dir, 'index.ts'));
  const example1 = readFileSync(resolve(dir, 'data/example'), 'utf8');
  // Optional dedicated example for part 2 (when the statement gives a different one)
  const example2Path = resolve(dir, 'data/example2');
  const example2 = existsSync(example2Path) ? readFileSync(example2Path, 'utf8') : example1;

  // A day in progress only has to pass part 1
  const parts: (1 | 2)[] = mod.firstPartCompleted ? [1, 2] : [1];
  const results: PartResult[] = [];
  // Solutions may document why an example can't be checked (e.g. input-specific shortcut):
  // export const exampleTestSkip = { 2: 'reason' };
  const skip: Partial<Record<1 | 2, string>> = mod.exampleTestSkip ?? {};
  for (const part of parts) {
    if (skip[part]) {
      results.push({ part, skipped: skip[part]! });
      continue;
    }
    const start = performance.now();
    const actual = await mod[`solve${part}`](part === 1 ? example1 : example2);
    const ms = performance.now() - start;
    const expected = mod[`exampleAnswer${part}`];
    results.push({ part, ok: actual === expected, expected, actual, ms });
  }
  // Marker: solutions may console.log their own output
  process.stdout.write(
    `\n@@RESULT@@${JSON.stringify(results, (_, v) => (typeof v === 'bigint' ? `${v}n` : v))}\n`
  );
};

run().catch((error) => {
  process.stderr.write(String(error?.stack ?? error));
  process.exit(1);
});
