import { getProblem, getYearData, type ProblemsData } from '../data/problems';

interface DayGridProps {
  data: ProblemsData;
  year: number;
  selectedDay: number | null;
  onDayChange: (day: number) => void;
}

/** Since 2025 an Advent of Code event has 12 days instead of 25. */
const daysInEvent = (year: number) => (year >= 2025 ? 12 : 25);

function Star({ lit, delay }: { lit: boolean; delay: number }) {
  return (
    <span
      className={`block w-1.5 h-1.5 rounded-full ${lit ? 'bg-accent-gold glow-gold star-in' : 'bg-grid-line'}`}
      style={lit ? { animationDelay: `${delay}ms` } : undefined}
    />
  );
}

export function DayGrid({ data, year, selectedDay, onDayChange }: DayGridProps) {
  const yearData = getYearData(data, year);
  const total = daysInEvent(year);
  const days = Array.from({ length: total }, (_, i) => i + 1);
  const stars = days.reduce((n, d) => {
    const p = getProblem(data, year, d);
    return n + (p?.firstPartCompleted ? 1 : 0) + (p?.secondPartCompleted ? 1 : 0);
  }, 0);

  return (
    <section className="mt-8" aria-label={`Days of ${year}`}>
      <p className="text-text-secondary">
        {stars} of {total * 2} stars
      </p>
      <div className="mt-2 h-0.5 rounded-full bg-grid-line overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-accent-gold via-accent-pink to-accent-blue shadow-[0_0_10px_#ff5cc880] transition-[width] duration-700"
          style={{ width: `${(stars / (total * 2)) * 100}%` }}
        />
      </div>

      <ol
        className={`mt-6 grid gap-1.5 grid-cols-6 ${total === 12 ? 'sm:grid-cols-12' : 'sm:grid-cols-[repeat(13,minmax(0,1fr))]'}`}
      >
        {days.map((day) => {
          const available = yearData?.days.includes(day) ?? false;
          const problem = getProblem(data, year, day);
          const selected = selectedDay === day;
          return (
            <li key={day}>
              <button
                onClick={() => available && onDayChange(day)}
                disabled={!available}
                aria-current={selected ? 'date' : undefined}
                aria-label={`Day ${day}${problem?.title ? `, ${problem.title}` : ''}`}
                title={problem?.title}
                className={`w-full flex flex-col items-center gap-2 rounded-lg py-3 transition-colors ${
                  selected
                    ? 'bg-bg-highlight glow-cyan text-text-primary'
                    : available
                      ? 'text-text-secondary hover:bg-bg-panel hover:text-text-primary'
                      : 'text-grid-line cursor-default'
                }`}
              >
                <span className="text-lg font-light leading-none">{day}</span>
                <span className="flex gap-1" aria-hidden="true">
                  <Star lit={!!problem?.firstPartCompleted} delay={day * 35} />
                  <Star lit={!!problem?.secondPartCompleted} delay={day * 35 + 120} />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
