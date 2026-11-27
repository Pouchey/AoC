---
name: new-day
description: Set up an AoC day (folder, data, statement) and summarize the puzzle.
argument-hint: '[day] [year]'
disable-model-invocation: true
allowed-tools: Bash(npm start *) Bash(npm run get-subject *)
---

Day `$ARGUMENTS` (`<day> <year>`; empty = today, December only).

1. `npm start <day> <year> < /dev/null` — creates `YYYY/DD/`, fetches data. Missing/expired
   cookie: stop, ask the user to fix `.env`. Empty `data/example`: ask which block of `Part1.md`
   is the example.
2. `npm run get-subject <day> <year>`, then set `exampleAnswer1` in `YYYY/DD/index.ts`.
3. Summarize in a few lines: input shape (`head -3`, `wc -l`, never the whole input), what part 1
   asks, useful `utils/` helpers.

Write the solution only if asked; then re-run step 1 to check the example and timing.
