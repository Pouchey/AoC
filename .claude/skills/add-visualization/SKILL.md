---
name: add-visualization
description: Add or improve the web visualization of an AoC day.
argument-hint: '<day> <year>'
---

Visualize `$ARGUMENTS`. Each day is `web/src/components/problems/<year>/d<DD>/` (picked up
automatically, loaded on demand). Copy a similar day, e.g. `2025/d04` (grid), `2025/d08` (canvas).

1. `trace.ts`: pure TS, no React/Vite (also run in Node). Export
   `trace: TraceFn<Frame>` from `../../viz/types` returning `{ frames, answer }` for `(input, part)`.
   Helpers in `viz/lib.ts`. Keep frames ≲ 500 (sample) and share big arrays between frames.
   If the repo has no solution for the day: `export const expected = { 1: …, 2: … }`. Part only
   valid on the real input: `export const parts = [1]`.
2. `index.tsx`: default export `(props: VizProps) => <DayViz {...props} trace={trace} caption=… render=… />`
   with `Stat`/`Stats`, `GridCanvas` or `Canvas` from `../../viz/`; colors from `viz/colors.ts`.
   Never pass an inline `trace` function (it would recompute every render).
3. Single-part day (day 25, 2025 day 12): add it to `singlePart` in `problems/visualizations.tsx`.
4. Check: `npm run test:viz -- <year> <day>` (add `--input` locally to compare with the solution on
   the real input), `npm --prefix web run build && npm --prefix web run lint`, then look at the page.
