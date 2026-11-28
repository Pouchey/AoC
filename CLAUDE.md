# AoC — Advent of Code in TypeScript

Solutions in `YYYY/DD/`, CLI runner `main.ts`, shared helpers `utils/`, Vite/React site `web/`
(GitHub Pages). Human docs: `README.md`, `RULES.md` — read only if needed.

## Commands

- `npm start <day> <year> < /dev/null` — scaffold + fetch data if missing, run current part on
  example then input. Stdin closed = never submits. Never answer its submit prompt.
- `npm run get-subject <day> <year>` — writes `Part1.md`/`Part2.md`
- Checks (or `/verify`): `npm run typecheck && npm run lint && npm test` (one day:
  `npm test -- <year> <day>`); if `web/` or `utils/` changed, also
  `npm --prefix web run build && npm --prefix web run lint && npm run test:viz`

## Solution contract (`YYYY/DD/index.ts`, from `template/index.ts`)

Exports `solve1(input)`, `solve2(input)`, `exampleAnswer1`, `exampleAnswer2`,
`firstPartCompleted` (runner runs part 2 when `true`). Part 2 uses `data/example2` if present;
an example part that can't be checked is documented with `exampleTestSkip = { 2: 'reason' }`.
Parse in `loadData`, import helpers from `../../utils` (grid, movement, range, math, memoize, bfs/dfs, shape, z3) before writing new ones.

## Rules

- `data/input` is git-ignored: never commit it, never print it whole (inspect with `head`/`wc`).
  Web code loads inputs only optionally, as in `web/src/components/problems/2025/day12.tsx`.
- Never read `.env`, never submit answers. Only `utils/aoc.ts` calls adventofcode.com.
- Days 1-12 since 2025; AoC time is UTC-5 (`utils/date.ts`).
- Prettier style (auto-applied by hook); don't reformat or refactor old solutions unasked.
