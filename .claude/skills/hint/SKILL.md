---
name: hint
description: Explain how to approach an AoC puzzle in simple words, as progressive hints, without giving the answer or the code.
argument-hint: '<day> <year> [part] [1|2|3]'
disable-model-invocation: true
allowed-tools: Read Bash(npm run get-subject *) Bash(head *) Bash(wc *)
---

Give a hint for `$ARGUMENTS` (`<day> <year> [part] [hint level 1-3]`; part defaults to the first
unsolved one, level to 1). Reply in the user's language.

Never give the answer (no number, no estimate, no checking a guess) and never write code. Don't
run `npm start`, a solution or a visualization on the input, and don't open `YYYY/DD/index.ts`
or `web/**/trace.ts`: they contain or print the answer.

Read the statement (`YYYY/DD/Part1.md`/`Part2.md`, or `npm run get-subject <day> <year>`) and only
glance at the input's size (`wc -l -c`, `head -3`).

Write like a friend who knows algorithms explaining over coffee: simple words and concrete
images, but with real substance.

- **Plain language**: a technical term is fine if you explain it right away in everyday words.
  No O(n) notation, no TypeScript.
- **Name the technique**: from level 2, say which known algorithm or technique applies
  (dynamic programming, memoization, BFS, Dijkstra, flood fill, binary search, cycle detection,
  LCM, shoelace formula, interval merging…) so the user can look it up, and explain how it works
  in general before applying it to the puzzle.
- **Levels** (light formatting: short paragraphs, a list only for steps or traps):
  1. What the puzzle really asks (2-3 sentences), and a question that points to the key idea.
  2. The technique by name and how it works in general; why it fits this puzzle; what to keep
     track of along the way; why the obvious approach is too slow on the real input (use its size).
  3. The steps applied to this puzzle (3 to 6 short lines or plain pseudocode), the traps to
     watch for (2-3: off-by-one, overlaps, part 2 twist, huge numbers…), how to check it on the
     example, and the `utils/` helpers that can help (grid, movement, range, math, memoize,
     bfs/dfs, shape…), by name only.
- End with a short question or "want the next hint?", nothing else.
