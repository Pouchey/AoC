import { useNavigate } from 'react-router-dom';
import { getYearData, getProblem, type ProblemsData } from '../data/problems';

interface DayGridProps {
  data: ProblemsData;
  year: number;
  selectedDay: number | null;
}

export function DayGrid({ data, year, selectedDay }: DayGridProps) {
  const navigate = useNavigate();
  const yearData = getYearData(data, year);

  if (!yearData) return null;

  const handleDayClick = (day: number) => {
    navigate(`/${year}/${day}`);
  };

  return (
    <div className="bg-bg-panel rounded-2xl p-6 border border-grid-line mb-8">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-accent-red via-accent-green to-accent-blue rounded-t-2xl" />

      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-green rounded-full" />
        Select a Day
      </h2>

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {Array.from({ length: 25 }, (_, i) => i + 1).map((day) => {
          const isAvailable = yearData.days.includes(day);
          const problem = getProblem(data, year, day);
          const isFirstPartCompleted = problem?.firstPartCompleted;
          const isSecondPartCompleted = problem?.secondPartCompleted;
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => isAvailable && handleDayClick(day)}
              disabled={!isAvailable}
              className={`
                aspect-square rounded-lg font-mono font-bold text-lg transition-all duration-200 relative
                ${
                  isSelected
                    ? 'bg-linear-to-br from-accent-purple to-accent-blue text-white shadow-lg shadow-accent-purple/30 scale-110 z-10'
                    : isAvailable
                      ? isSecondPartCompleted
                        ? 'bg-bg-highlight border border-accent-green/30 text-accent-green hover:border-accent-green hover:bg-accent-green/10 hover:scale-105'
                        : isFirstPartCompleted
                          ? 'bg-bg-highlight border border-accent-gold/30 text-accent-gold hover:border-accent-gold hover:bg-accent-gold/10 hover:scale-105'
                          : 'bg-bg-highlight border border-grid-line text-text-secondary hover:border-text-secondary hover:bg-bg-highlight/80 hover:scale-105'
                      : 'bg-bg-dark/50 text-text-secondary/30 cursor-not-allowed'
                }
              `}
            >
              {day}
              {isSecondPartCompleted && !isSelected && (
                <span className="absolute -top-1 -right-1 text-xs">⭐⭐</span>
              )}
              {isFirstPartCompleted && !isSecondPartCompleted && !isSelected && (
                <span className="absolute -top-1 -right-1 text-xs">⭐</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
