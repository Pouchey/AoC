---
name: add-visualization
description: Add an interactive visualization of an AoC day to the web site (web/). Use when the user wants to visualize or animate a puzzle or solution on the site.
argument-hint: '<day> <year> [part1|part2]'
---

Add a visualization for `$ARGUMENTS`. Use the 2025 day 12 one as the reference implementation:
`web/src/components/problems/2025/day12.tsx` and its `day12/` folder.

1. **Aliases for a new year**: the site imports solutions through `@aoc/<year>`. If the year is new,
   add it to `resolve.alias` in `web/vite.config.ts` and to `compilerOptions.paths` in
   `web/tsconfig.app.json` (same shape as `@aoc/2025`).
2. **Component**: create `web/src/components/problems/<year>/day<DD>.tsx` (subcomponents and hooks
   in `day<DD>/`). Reuse parsing and logic from `utils/` and from `<year>/<DD>/index.ts` through the
   aliases rather than duplicating them.
3. **Data**: import the example with `?raw`. Never import `data/input` directly: inputs are
   git-ignored, so CI would fail and the input would be published. Load it optionally like day 12:
   `import.meta.glob<string>('/../<year>/<DD>/data/inpu[t]', { query: '?raw', import: 'default', eager: true })`
   and only show the "Input" option when it exists.
4. **Register** it in `web/src/components/problems/visualizations.tsx` with the key
   `'<year>-<DD>-part1'` (or `part2`).
5. **Performance**: long computations must stay interruptible and not freeze the UI (chunk work,
   `startTransition`, a stop button), like `day12/useRunAll.ts`.
6. Check with `npm --prefix web run build` and `npm --prefix web run lint`, then run
   `npm --prefix web run dev` (or the `run` skill) and look at the page.
