import type { Problem } from '../../types';

interface ProblemHeaderProps {
  year: number;
  day: number;
  problem: Problem;
}

export function ProblemHeader({ year, day, problem }: ProblemHeaderProps) {
  return (
    <div className="flex items-baseline justify-between gap-x-6 gap-y-2 flex-wrap">
      <h2 className="text-3xl sm:text-4xl font-light tracking-tight flex items-center gap-4">
        <span className="neon-rule" aria-hidden="true" />
        <span>
          <span className="text-text-secondary">Day {day}</span> {problem.title || ''}
        </span>
      </h2>
      <a
        href={`https://adventofcode.com/${year}/day/${day}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-accent-blue hover:underline underline-offset-4"
      >
        Open the puzzle on adventofcode.com
      </a>
    </div>
  );
}
