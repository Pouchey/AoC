import type { Problem } from '../../types';

interface ProblemTabsProps {
  activeTab: 'part1' | 'part2';
  onTabChange: (tab: 'part1' | 'part2') => void;
  problem: Problem;
}

export function ProblemTabs({ activeTab, onTabChange, problem }: ProblemTabsProps) {
  const tabs = [
    { id: 'part1' as const, label: 'Part 1', done: problem.firstPartCompleted },
    { id: 'part2' as const, label: 'Part 2', done: problem.secondPartCompleted }
  ];
  return (
    <div
      className="mt-8 inline-flex rounded-lg bg-bg-panel p-1"
      role="tablist"
      aria-label="Puzzle part"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm transition-colors ${
            activeTab === tab.id
              ? 'bg-bg-highlight text-text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {tab.label}
          <span
            className={`w-1.5 h-1.5 rounded-full ${tab.done ? 'bg-accent-gold' : 'bg-grid-line'}`}
            aria-label={tab.done ? 'solved' : 'not solved'}
          />
        </button>
      ))}
    </div>
  );
}
