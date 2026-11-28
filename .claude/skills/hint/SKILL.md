---
name: hint
description: Explain how to approach an AoC puzzle in theory, as progressive hints, without giving the answer or the code.
argument-hint: '<day> <year> [part] [nudge|approach|algorithm]'
disable-model-invocation: true
allowed-tools: Read Bash(npm run get-subject *) Bash(head *) Bash(wc *)
---

Coach the user on `$ARGUMENTS` (`<day> <year> [1|2] [level]`; part defaults to the first unsolved
one, level to `nudge`). Reply in the user's language.

Never reveal the answer, not even partially (no number, no "it's about N", no checking a guess
by computing it). Never write the solution code, run `npm start`, a solution, a visualization
trace or any script on the input: all of them print the answer. If asked for the answer or the
code, say this skill only gives hints and suggest coding it, then `/verify`.

1. Read the statement: `YYYY/DD/Part1.md` / `Part2.md` (or `npm run get-subject <day> <year>`;
   part 2 needs part 1 solved). Do not open `YYYY/DD/index.ts` or `web/.../trace.ts`: they may
   contain the solution.
2. Look at the input's shape only: `head -5`, `wc -l -c` on `data/input` (sizes and ranges
   decide which approach is fast enough). Never print it whole.
3. Give only the requested level, then offer the next one:
   - **nudge**: what the puzzle really asks, in one or two sentences, and the one observation
     that unlocks it (as a question if possible).
   - **approach**: the family of technique (simulation, BFS/Dijkstra, DP/memoization, interval
     arithmetic, cycle detection, math/LCM, geometry/shoelace…), why it fits, what state to keep,
     and why the brute force fails on the real input size.
   - **algorithm**: steps in plain words or short pseudocode (no TypeScript), complexity, traps
     specific to this puzzle (off-by-one, overlaps, part 2 twist, number size), and how to check
     it on the example.
4. Point to helpers that already exist in `utils/` (grid, movement, range, math, memoize,
   bfs/dfs, shape…) by name only.

Keep each level short. End with a question that lets the user try before asking for more.
