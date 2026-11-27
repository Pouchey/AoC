/**
 * Checks that every web visualization computes the right answer on the example, so the
 * animation can't silently disagree with the solution.
 * Each web/src/components/problems/<year>/dDD/trace.ts exports `trace(input, part)`;
 * its answer must equal the solution's exampleAnswer1/2 (or the trace's own `expected`).
 * With --input, also compares with the solution on the local (git-ignored) input.
 * Usage: npm run test:viz [-- [--input] <year> [day]]
 */
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = 'web/src/components/problems';
const args = process.argv.slice(2);
const withInput = args.includes('--input');
const [yearFilter, dayFilter] = args.filter((a) => a !== '--input');

const traces = readdirSync(ROOT)
  .filter((y) => /^\d{4}$/.test(y) && (!yearFilter || y === yearFilter))
  .flatMap((y) =>
    readdirSync(join(ROOT, y))
      .filter((d) => /^d\d{2}$/.test(d) && (!dayFilter || d === `d${dayFilter.padStart(2, '0')}`))
      .map((d) => ({ year: y, day: d.slice(1), file: join(ROOT, y, d, 'trace.ts') }))
  )
  .filter(({ file }) => existsSync(file));

const main = async () => {
  let failures = 0;
  for (const { year, day, file } of traces) {
    const mod = await import(resolve(file));
    const solution = await import(resolve(year, day, 'index.ts'));
    const parts: (1 | 2)[] = mod.parts ?? [1, 2];
    const results: string[] = [];
    for (const part of parts) {
      const expected = mod.expected?.[part] ?? solution[`exampleAnswer${part}`];
      const ex2 = join(year, day, 'data/example2');
      const file = part === 2 && existsSync(ex2) ? ex2 : join(year, day, 'data/example');
      const input = readFileSync(file, 'utf8');
      try {
        const start = performance.now();
        const { answer, frames } = mod.trace(input, part);
        const ms = (performance.now() - start).toFixed(0);
        const ok = String(answer) === String(expected) && frames.length > 0;
        if (!ok) failures++;
        results.push(
          ok
            ? `p${part} ok (${frames.length} frames, ${ms}ms)`
            : `p${part} FAIL expected ${expected} got ${answer} (${frames.length} frames)`
        );
      } catch (error) {
        failures++;
        results.push(`p${part} ERROR ${(error as Error).message}`);
      }
    }
    const inputFile = join(year, day, 'data/input');
    if (withInput && existsSync(inputFile)) {
      const input = readFileSync(inputFile, 'utf8');
      for (const part of parts) {
        if (solution.exampleTestSkip?.[part]) continue;
        try {
          const { answer } = mod.trace(input, part);
          const expected = await solution[`solve${part}`](input);
          const ok = String(answer) === String(expected);
          if (!ok) failures++;
          results.push(ok ? `input p${part} ok` : `input p${part} FAIL expected ${expected} got ${answer}`);
        } catch (error) {
          failures++;
          results.push(`input p${part} ERROR ${(error as Error).message}`);
        }
      }
    }
    const ok = results.every((r) => / ok\b/.test(r));
    console.log(`${ok ? '✓' : '✗'} ${year}/${day}  ${results.join(' | ')}`);
  }
  console.log(`\n${traces.length} visualizations, ${failures} failing part(s)`);
  process.exit(failures ? 1 : 0);
};

main();
