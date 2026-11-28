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

Write like you would explain it to a friend over coffee:

- **Short**: 2 to 4 sentences per level. No headings, no lists unless steps really need them.
- **Simple words**: no jargon (DP, memoization, complexity, O(n)…) unless the user uses it first.
  Prefer a concrete image ("like counting cars at each crossroad") to a technical term.
- **One idea per level**:
  1. What the puzzle really asks, and a question that points to the key idea.
  2. The key idea in plain words, and why the obvious way would be too slow.
  3. The steps in plain words (3 to 5 short lines), plus the one trap to watch for.
- End with a short question or "want the next hint?", nothing else.
