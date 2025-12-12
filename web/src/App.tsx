import { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { YearSelector } from './components/YearSelector';
import { DayGrid } from './components/DayGrid';
import { ProblemViewer } from './components/ProblemViewer';
import { StatsPanel } from './components/StatsPanel';
import { loadProblemsData, type ProblemsData } from './data/problems';

function AppContent() {
  const { year: yearParam, day: dayParam } = useParams<{ year?: string; day?: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ProblemsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Parse route params
  const selectedYear = yearParam ? parseInt(yearParam, 10) : 2025;
  const selectedDay = dayParam ? parseInt(dayParam, 10) : null;

  useEffect(() => {
    loadProblemsData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const handleYearSelect = (year: number) => {
    navigate(`/${year}`);
  };

  const handleDaySelect = (day: number) => {
    navigate(`/${selectedYear}/${day}`);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎄</div>
          <p className="text-text-secondary">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,185,80,0.03)_0%,transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(30,36,44,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(30,36,44,0.5)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none opacity-30" />

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <Header />

        <div className="grid lg:grid-cols-[1fr,300px] gap-8">
          <div className="space-y-6">
            <YearSelector
              years={data.years}
              selectedYear={selectedYear}
              onSelectYear={handleYearSelect}
            />

            {selectedYear && (
              <DayGrid
                data={data}
                year={selectedYear}
                selectedDay={selectedDay}
                onSelectDay={handleDaySelect}
              />
            )}

            {selectedYear && selectedDay && (
              <ProblemViewer data={data} year={selectedYear} day={selectedDay} />
            )}

            {selectedYear && !selectedDay && (
              <div className="bg-bg-panel rounded-2xl p-12 border border-grid-line text-center">
                <div className="text-6xl mb-4">🎄</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Select a Day</h3>
                <p className="text-text-secondary">
                  Click on a day above to view the problem and solution
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <StatsPanel data={data} />

            {/* Quick Links */}
            <div className="bg-bg-panel rounded-2xl p-6 border border-grid-line">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-3.5 bg-accent-blue rounded-full" />
                Quick Links
              </h3>
              <div className="space-y-2">
                <a
                  href="https://adventofcode.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-bg-highlight hover:bg-grid-line transition-colors group"
                >
                  <span className="text-xl">🌐</span>
                  <span className="text-text-primary group-hover:text-accent-blue transition-colors">
                    Advent of Code
                  </span>
                </a>
                <a
                  href={
                    selectedYear && selectedDay
                      ? `https://github.com/Pouchey/AoC/tree/main/${selectedYear}/${selectedDay
                          .toString()
                          .padStart(2, '0')}`
                      : selectedYear
                        ? `https://github.com/Pouchey/AoC/tree/main/${selectedYear}`
                        : 'https://github.com/Pouchey/AoC'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-bg-highlight hover:bg-grid-line transition-colors group"
                >
                  <span className="text-xl">📁</span>
                  <span className="text-text-primary group-hover:text-accent-blue transition-colors">
                    GitHub Repository
                  </span>
                </a>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-bg-panel rounded-2xl p-6 border border-grid-line">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-3.5 bg-accent-purple rounded-full" />
                Legend
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-highlight border border-accent-green/30 flex items-center justify-center text-accent-green font-mono font-bold text-sm">
                    1
                  </div>
                  <span className="text-text-secondary text-sm">Completed (⭐ both parts)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-highlight border border-accent-gold/30 flex items-center justify-center text-accent-gold font-mono font-bold text-sm">
                    2
                  </div>
                  <span className="text-text-secondary text-sm">In Progress</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-dark/50 flex items-center justify-center text-text-secondary/30 font-mono font-bold text-sm">
                    3
                  </div>
                  <span className="text-text-secondary text-sm">Not Started</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-grid-line text-center text-text-secondary text-sm">
          <p>Made with ❤️ for Advent of Code</p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/2025" replace />} />
      <Route path="/:year" element={<AppContent />} />
      <Route path="/:year/:day" element={<AppContent />} />
    </Routes>
  );
}

export default App;
