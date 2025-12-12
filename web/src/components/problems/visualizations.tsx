import type { ComponentType } from 'react';
import { Day12Visualization } from './2025/day12';

interface VisualizationProps {
  year: number;
  day: number;
}

const problemVisualizations = new Map<
  string,
  ComponentType<VisualizationProps>
>();

// Register visualizations
problemVisualizations.set('2025-12-part1', Day12Visualization);

export function getProblemVisualization(
  year: number,
  day: number,
  part: 'part1' | 'part2'
): ComponentType<VisualizationProps> | null {
  const key = `${year}-${day.toString().padStart(2, '0')}-${part}`;
  return problemVisualizations.get(key) || null;
}

