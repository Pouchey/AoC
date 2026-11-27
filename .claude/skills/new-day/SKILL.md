---
name: new-day
description: Prepare an Advent of Code day in this repo (folder from template, example/input data, puzzle text) and summarize the puzzle. Use when the user wants to start a new AoC day.
argument-hint: '[day] [year]'
disable-model-invocation: true
allowed-tools: Bash(npm start *) Bash(npm run get-subject *) Bash(npm run typecheck) Bash(npm run lint)
---

Prepare day `$ARGUMENTS` (format `<day> <year>`; if empty, today's puzzle during December, AoC
time UTC-5). Since 2025 an event has 12 days.

1. Scaffold and fetch data without submitting anything:
   `npm start <day> <year> < /dev/null`
   This creates `YYYY/DD/` from `template/`, downloads `data/example` + `data/input`, and adds the
   day to `web/public/problems.json`. Closing stdin means the submit prompt is skipped: never answer
   it for the user.
   - If it reports a missing/expired `AOC_SESSION_COOKIE`, stop and tell the user to update `.env`
     (never read `.env` yourself).
   - If the example file is empty, the puzzle page had no obvious example block: show the code
     blocks of `Part1.md` and ask the user which one is the example.
2. Fetch the statement: `npm run get-subject <day> <year>` (writes `Part1.md`, and `Part2.md` once
   part 1 is solved).
3. Check `data/example` matches the example in `Part1.md`, and fill `exampleAnswer1` in
   `YYYY/DD/index.ts` from the statement.
4. Give the user a short summary: what the input looks like (shape only, never paste
   `data/input`), what part 1 asks, and the relevant helpers already in `utils/` (grid, movement,
   range, memoize, bfs/dfs, z3…).

Only write the solution if the user asks for it. When you do, follow @RULES.md, and run
`npm start <day> <year> < /dev/null` to check the example answer and timing.
