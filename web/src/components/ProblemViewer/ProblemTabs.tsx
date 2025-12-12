interface ProblemTabsProps {
  activeTab: 'part1' | 'part2';
  onTabChange: (tab: 'part1' | 'part2') => void;
}

export function ProblemTabs({ activeTab, onTabChange }: ProblemTabsProps) {
  return (
    <div className="flex border-b border-grid-line">
      <button
        onClick={() => onTabChange('part1')}
        className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
          activeTab === 'part1'
            ? 'text-accent-green bg-bg-highlight/50'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-highlight/30'
        }`}
      >
        Part 1
        {activeTab === 'part1' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-green" />
        )}
      </button>
      <button
        onClick={() => onTabChange('part2')}
        className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
          activeTab === 'part2'
            ? 'text-accent-purple bg-bg-highlight/50'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-highlight/30'
        }`}
      >
        Part 2
        {activeTab === 'part2' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-purple" />
        )}
      </button>
    </div>
  );
}

