import { createElement, lazy, Suspense, type ComponentType } from 'react';
import { Day12Visualization } from './2025/day12';
import type { VizProps } from './viz/types';

// Each day lives in ./<year>/dDD/index.tsx and is loaded on demand (own chunk).
const dayModules = import.meta.glob<{ default: ComponentType<VizProps> }>(
  './*/d[0-9][0-9]/index.tsx'
);

const lazyDays = new Map<string, ComponentType<VizProps>>();
for (const [path, load] of Object.entries(dayModules)) {
  const [, year, day] = path.match(/^\.\/(\d{4})\/d(\d{2})\//)!;
  const Lazy = lazy(load);
  lazyDays.set(`${year}-${day}`, (props: VizProps) => (
    <Suspense
      fallback={
        <div className="bg-bg-highlight rounded-xl p-6 border border-grid-line text-text-secondary text-sm">
          Loading visualization…
        </div>
      }
    >
      <Lazy {...props} />
    </Suspense>
  ));
}

// Hand-made visualizations that replace the generic one for a given part
const custom = new Map<string, ComponentType<VizProps>>([['2025-12-part1', Day12Visualization]]);

export function getProblemVisualization(
  year: number,
  day: number,
  part: 'part1' | 'part2'
): ComponentType<VizProps> | null {
  const key = `${year}-${day.toString().padStart(2, '0')}`;
  return custom.get(`${key}-${part}`) ?? lazyDays.get(key) ?? null;
}

export function renderVisualization(year: number, day: number, part: 1 | 2) {
  const component = getProblemVisualization(year, day, part === 1 ? 'part1' : 'part2');
  return component ? createElement(component, { year, day, part }) : null;
}
