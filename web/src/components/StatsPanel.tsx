import type { ProblemsData } from '../data/problems';

interface StatsPanelProps {
  data: ProblemsData;
}

export function StatsPanel({ data }: StatsPanelProps) {
  const totalDays = data.years.reduce((acc, y) => acc + y.days.length, 0);
  const firstPartStars = Object.values(data.problems).filter((p) => p.firstPartCompleted).length;
  const secondPartStars = Object.values(data.problems).filter((p) => p.secondPartCompleted).length;
  const totalStars = firstPartStars + secondPartStars;

  return (
    <div className="bg-bg-panel rounded-2xl p-6 border border-grid-line">
      <div className="h-1 bg-linear-to-r from-accent-gold via-accent-green to-accent-gold absolute top-0 left-0 right-0 rounded-t-2xl" />

      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="w-1 h-3.5 bg-accent-gold rounded-full" />
        Statistics
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-accent-green font-mono">{data.years.length}</div>
          <div className="text-text-secondary text-sm mt-1">Years</div>
        </div>
        <div className="text-center border-x border-grid-line">
          <div className="text-3xl font-bold text-accent-blue font-mono">{totalDays}</div>
          <div className="text-text-secondary text-sm mt-1">Problems</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-accent-gold font-mono">{totalStars}</div>
          <div className="text-text-secondary text-sm mt-1">Stars ⭐</div>
        </div>
      </div>
    </div>
  );
}
