import type { YearData } from '../types';

interface YearSelectorProps {
  years: YearData[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

/** The selected year is the page title; the other years are quiet text links beside it. */
export function YearSelector({ years, selectedYear, onYearChange }: YearSelectorProps) {
  return (
    <div className="mt-14 flex items-end gap-6 flex-wrap" role="tablist" aria-label="Year">
      {years.map(({ year }) => {
        const active = year === selectedYear;
        return (
          <button
            key={year}
            role="tab"
            aria-selected={active}
            onClick={() => onYearChange(year)}
            className={
              active
                ? 'text-6xl sm:text-7xl font-light tracking-tight text-text-primary leading-none'
                : 'text-xl font-light text-text-secondary hover:text-text-primary transition-colors pb-1.5'
            }
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}
