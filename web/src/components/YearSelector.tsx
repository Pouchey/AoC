import type { YearData } from '../types';

interface YearSelectorProps {
  years: YearData[];
  selectedYear: number | null;
  onYearChange: (year: number) => void;
}

export function YearSelector({ years, selectedYear, onYearChange }: YearSelectorProps) {
  const handleYearClick = (year: number) => {
    onYearChange(year);
  };

  return (
    <div className="flex gap-3 flex-wrap justify-center mb-8">
      {years.map((yearData) => (
        <button
          key={yearData.year}
          onClick={() => handleYearClick(yearData.year)}
          className={`
            px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200
            ${
              selectedYear === yearData.year
                ? 'bg-linear-to-r from-accent-green to-accent-green/80 text-white shadow-lg shadow-accent-green/20 scale-105'
                : 'bg-bg-panel border border-grid-line text-text-primary hover:border-accent-green/50 hover:bg-bg-highlight'
            }
          `}
        >
          <span className="mr-2">📅</span>
          {yearData.year}
          <span className="ml-2 text-sm opacity-70">({yearData.days.length} days)</span>
        </button>
      ))}
    </div>
  );
}
