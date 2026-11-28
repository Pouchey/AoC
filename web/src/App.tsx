import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { YearSelector } from './components/YearSelector';
import { DayGrid } from './components/DayGrid';
import { ProblemViewer } from './components/ProblemViewer';
import { loadProblemsData, type ProblemsData } from './data/problems';

// Latest AoC edition: current year from December, previous year otherwise
const now = new Date();
const DEFAULT_YEAR = String(now.getMonth() === 11 ? now.getFullYear() : now.getFullYear() - 1);

function App() {
  const [data, setData] = useState<ProblemsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Parse query params - initialize default year if needed
  const getSearchParams = (): { year: string | null; day: string | null } => {
    const params = new URLSearchParams(window.location.search);
    const year = params.get('year');
    const day = params.get('day');

    // Initialize default year if no query params
    if (!year) {
      params.set('year', DEFAULT_YEAR);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
      return { year: DEFAULT_YEAR, day: null };
    }

    return { year, day };
  };

  const [searchParams, setSearchParams] = useState<{ year: string | null; day: string | null }>(
    getSearchParams
  );

  // Update search params when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchParams({
        year: params.get('year') || DEFAULT_YEAR,
        day: params.get('day')
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const selectedYear = searchParams.year
    ? parseInt(searchParams.year, 10)
    : parseInt(DEFAULT_YEAR, 10);
  const selectedDay = searchParams.day ? parseInt(searchParams.day, 10) : null;

  useEffect(() => {
    loadProblemsData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  // Helper function to update query params
  const updateQueryParams = (updates: { year?: number; day?: number | null }) => {
    const params = new URLSearchParams(window.location.search);

    if (updates.year !== undefined) {
      params.set('year', updates.year.toString());
    }

    if (updates.day !== undefined) {
      if (updates.day === null) {
        params.delete('day');
      } else {
        params.set('day', updates.day.toString());
      }
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
    setSearchParams({
      year: params.get('year'),
      day: params.get('day')
    });
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        Loading puzzles…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 pb-24">
        <Header data={data} year={selectedYear} day={selectedDay} />

        <main>
          <YearSelector
            years={data.years}
            selectedYear={selectedYear}
            onYearChange={(year) => updateQueryParams({ year, day: null })}
          />

          <DayGrid
            data={data}
            year={selectedYear}
            selectedDay={selectedDay}
            onDayChange={(day) => updateQueryParams({ year: selectedYear, day })}
          />

          {selectedDay ? (
            <ProblemViewer
              key={`${selectedYear}-${selectedDay}`}
              data={data}
              year={selectedYear}
              day={selectedDay}
            />
          ) : (
            <p className="mt-16 text-text-secondary max-w-md">
              Pick a day to read the puzzle, watch it being solved step by step and read the
              solution.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
