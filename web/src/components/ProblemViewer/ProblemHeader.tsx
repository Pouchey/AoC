import type { Problem } from '../../types';

interface ProblemHeaderProps {
  year: number;
  day: number;
  problem: Problem;
}

export function ProblemHeader({ year, day, problem }: ProblemHeaderProps) {
  return (
    <div className="p-6 border-b border-grid-line">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-accent-gold">Day {day}</span>
            <span className="text-text-secondary">—</span>
            <span>{problem.title || `Problem ${day}`}</span>
          </h2>
          <p className="text-text-secondary mt-1">Advent of Code {year}</p>
        </div>

        <div className="flex items-center gap-3">
          {problem.secondPartCompleted && (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-accent-green/10 border border-accent-green/30 rounded-full text-accent-green text-sm font-medium">
              <span>⭐⭐</span> Completed
            </span>
          )}
          {problem.firstPartCompleted && !problem.secondPartCompleted && (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-accent-gold/10 border border-accent-gold/30 rounded-full text-accent-gold text-sm font-medium">
              <span>⭐</span> Part 1 Done
            </span>
          )}
          <a
            href={`https://adventofcode.com/${year}/day/${day}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-bg-highlight border border-grid-line rounded-lg text-text-secondary hover:text-accent-blue hover:border-accent-blue/50 transition-colors text-sm font-medium"
          >
            View on AoC →
          </a>
        </div>
      </div>
    </div>
  );
}

