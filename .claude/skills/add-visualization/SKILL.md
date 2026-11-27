---
name: add-visualization
description: Add an interactive visualization of an AoC day to the web site.
argument-hint: '<day> <year> [part1|part2]'
---

Visualize `$ARGUMENTS`. Reference: `web/src/components/problems/2025/day12.tsx` + `day12/`.

1. New year: add `@aoc/<year>` to `resolve.alias` (`web/vite.config.ts`) and `paths`
   (`web/tsconfig.app.json`), like `@aoc/2025`.
2. Component in `web/src/components/problems/<year>/day<DD>.tsx`; reuse `utils/` and the solution
   through aliases.
3. Example via `?raw`. Input never imported directly (git-ignored): use
   `import.meta.glob<string>('/../<year>/<DD>/data/inpu[t]', { query: '?raw', import: 'default', eager: true })`
   and show the Input option only if present.
4. Register in `web/src/components/problems/visualizations.tsx` as `'<year>-<DD>-part1'`.
5. Long computations stay interruptible (see `day12/useRunAll.ts`).
6. `npm --prefix web run build && npm --prefix web run lint`, then check the page in a browser.
