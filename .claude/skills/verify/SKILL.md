---
name: verify
description: Run the repo checks (typecheck, lint, web build) and fix failures.
allowed-tools: Bash(npm run typecheck) Bash(npm run lint) Bash(npm test *) Bash(npm test) Bash(npm run lint:fix) Bash(npm --prefix web run build) Bash(npm --prefix web run lint) Bash(git diff *)
---

1. `npm run typecheck`
2. `npm run lint` (warnings in old solutions are OK, errors are not)
3. `npm test` (or `npm test -- <year> <day>` for the days changed): example regression
4. If `git diff --stat` touches `web/` or `utils/`: `npm --prefix web run build`, then
   `npm --prefix web run lint`

If `.github/`, `utils/aoc.ts` or `.claude/` changed, suggest the user runs `/security-review`.

Fix root causes; no disabled rules, `@ts-ignore` or skipped checks. Report one pass/fail line per
step, not the full logs.
