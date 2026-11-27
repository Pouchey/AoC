# AoC — Advent of Code solutions in TypeScript

Personal Advent of Code solutions (2023, 2025, …) with a CLI runner and a Vite/React site
deployed to GitHub Pages (https://pouchey.github.io/AoC/).

See @README.md for setup and usage, and @RULES.md for the solution file conventions.

## Commands

Root (solutions, runner, utils):

- `npm start [day] [year]` — scaffold the day if missing, fetch data, run the current part on the
  example then on the input, then **asks** before submitting. Interactive: never answer `y` for the
  user.
- `npm run get-subject [day] [year]` — save `Part1.md` / `Part2.md` for a day
- `npm run typecheck` — `tsc` on solutions + utils (excludes `web/` and `template/`)
- `npm run lint` / `npm run lint:fix` — ESLint 10 flat config + Prettier

Web (`cd web`):

- `npm run dev` — local site; `npm run build` — `tsc -b && vite build`; `npm run lint`

Run `npm run typecheck && npm run lint` (and `cd web && npm run build` when `web/` or `utils/`
changed) before considering a change done.

## Layout

- `YYYY/DD/index.ts` — one solution per day, exports `solve1`, `solve2`, `exampleAnswer1`,
  `exampleAnswer2`, `firstPartCompleted` (see @RULES.md)
- `YYYY/DD/data/example` (committed) and `YYYY/DD/data/input` (**git-ignored**)
- `utils/` — shared helpers re-exported from `utils/index.ts` (grid, movement, math, range, shape,
  memoize, bfs/dfs, z3…). `utils/aoc.ts` is the only place that talks to adventofcode.com
  (`aocFetch`); `utils/date.ts` resolves day/year (AoC time is UTC-5, 12 days per event since 2025)
- `template/index.ts` — copied for each new day
- `web/` — React 19 + Vite 8 + Tailwind 4 site; `web/public/problems.json` is updated by the runner;
  per-day visualizations live in `web/src/components/problems/YYYY/`

## Rules

- Never commit or print puzzle inputs (`data/input`): AoC asks that they are not shared. Web code
  must not hard-import an input; use the optional `import.meta.glob` pattern of
  `web/src/components/problems/2025/day12.tsx`.
- Never submit answers to adventofcode.com and never read or print `.env` (session cookie).
- Reuse/extend `utils/` instead of re-implementing grid, parsing or graph helpers in a solution.
- Code style: Prettier (single quotes, 100 cols, no trailing commas), strict TypeScript.
- Do not mass-reformat old solutions; touch only what the task needs.
- Inputs are big: prefer algorithms that finish in seconds; report solve time when relevant.
