---
name: verify
description: Run the repo checks (typecheck, lint, web build) and fix failures.
allowed-tools: Bash(npm run typecheck) Bash(npm run lint) Bash(npm run lint:fix) Bash(npm --prefix web run build) Bash(npm --prefix web run lint) Bash(git diff *)
---

1. `npm run typecheck`
2. `npm run lint` (warnings in old solutions are OK, errors are not)
3. If `git diff --stat` touches `web/` or `utils/`: `npm --prefix web run build`, then
   `npm --prefix web run lint`

Fix root causes; no disabled rules, `@ts-ignore` or skipped checks. Report one pass/fail line per
step, not the full logs.
