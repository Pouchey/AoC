---
name: verify
description: Run this repo's checks (typecheck, lint, web build/lint) and fix what fails. Use before committing or when the user asks to check the repo.
allowed-tools: Bash(npm run typecheck) Bash(npm run lint) Bash(npm run lint:fix) Bash(npm --prefix web run build) Bash(npm --prefix web run lint) Bash(git status *) Bash(git diff *)
---

Run the checks CI runs, from the repo root:

1. `npm run typecheck`
2. `npm run lint` (warnings in old solutions are accepted; errors are not)
3. If `web/`, `utils/` or a file imported by a visualization changed (see `git diff --stat`):
   `npm --prefix web run build` then `npm --prefix web run lint`

If a step fails, find the root cause and fix it in the code: do not disable rules, add
`@ts-ignore`, or skip checks. `npm run lint:fix` is fine for formatting-only errors, but only keep
its changes on files you were already touching.

Finish with a short pass/fail list per step.
