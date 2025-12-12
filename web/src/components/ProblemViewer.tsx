import { useState, useEffect, startTransition, createElement } from 'react';
import { getProblem, type ProblemsData } from '../data/problems';
import { fetchSolutionCode, extractFunction } from '../utils/codeFetcher';
import { CodeSnippet } from './CodeSnippet';
import { getProblemVisualization } from './problems/visualizations';

interface ProblemViewerProps {
  data: ProblemsData;
  year: number;
  day: number;
}

export function ProblemViewer({ data, year, day }: ProblemViewerProps) {
  const [activeTab, setActiveTab] = useState<'part1' | 'part2'>('part1');
  const [code1, setCode1] = useState<string | null>(null);
  const [code2, setCode2] = useState<string | null>(null);
  const [isLoadingCode, setIsLoadingCode] = useState(true);
  const problem = getProblem(data, year, day);

  useEffect(() => {
    let cancelled = false;

    startTransition(() => {
      setIsLoadingCode(true);
    });

    fetchSolutionCode(year, day)
      .then((fullCode) => {
        if (cancelled) return;

        if (fullCode) {
          const solve1Code = extractFunction(fullCode, 'solve1');
          const solve2Code = extractFunction(fullCode, 'solve2');
          setCode1(solve1Code);
          setCode2(solve2Code);
        } else {
          setCode1(null);
          setCode2(null);
        }
        setIsLoadingCode(false);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to fetch code:', error);
        setCode1(null);
        setCode2(null);
        setIsLoadingCode(false);
      });

    return () => {
      cancelled = true;
    };
  }, [year, day]);

  if (!problem) {
    return (
      <div className="bg-bg-panel rounded-2xl p-8 border border-grid-line text-center">
        <p className="text-text-secondary">Problem not found</p>
      </div>
    );
  }

  const dayPadded = day.toString().padStart(2, '0');
  const VisualizationComponent = getProblemVisualization(year, day, activeTab);

  return (
    <div className="bg-bg-panel rounded-2xl border border-grid-line overflow-hidden">
      {/* Gradient top border */}
      <div className="h-1 bg-linear-to-r from-accent-red via-accent-green to-accent-blue" />

      {/* Header */}
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

      {/* Tabs */}
      <div className="flex border-b border-grid-line">
        <button
          onClick={() => setActiveTab('part1')}
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
          onClick={() => setActiveTab('part2')}
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

      {/* Content */}
      <div className="p-6">
        {activeTab === 'part1' ? (
          <div className="space-y-6">
            {problem.part1Description ? (
              <div className="prose max-w-none">
                <p className="text-text-primary leading-relaxed">{problem.part1Description}</p>
              </div>
            ) : (
              <p className="text-text-secondary italic">No description available for Part 1</p>
            )}

            {problem.exampleAnswer1 !== undefined && (
              <div className="bg-bg-highlight rounded-xl p-4 border border-grid-line">
                <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-1 h-3 bg-accent-gold rounded-full" />
                  Example Answer
                </h4>
                <p className="font-mono text-2xl text-accent-gold font-bold">
                  {problem.exampleAnswer1}
                </p>
              </div>
            )}

            {VisualizationComponent && createElement(VisualizationComponent, { year, day })}

            <div className="bg-bg-highlight rounded-xl p-4 border border-grid-line">
              <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-1 h-3 bg-accent-blue rounded-full" />
                Solution File
              </h4>
              <code className="font-mono text-accent-blue bg-bg-dark px-3 py-2 rounded-lg block mb-4">
                {year}/{dayPadded}/index.ts → solve1()
              </code>
              {!isLoadingCode && code1 && (
                <div className="mt-4">
                  <CodeSnippet code={code1} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {problem.part2Description ? (
              <div className="prose max-w-none">
                <p className="text-text-primary leading-relaxed">{problem.part2Description}</p>
              </div>
            ) : (
              <p className="text-text-secondary italic">No description available for Part 2</p>
            )}

            {problem.exampleAnswer2 !== undefined && (
              <div className="bg-bg-highlight rounded-xl p-4 border border-grid-line">
                <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-1 h-3 bg-accent-gold rounded-full" />
                  Example Answer
                </h4>
                <p className="font-mono text-2xl text-accent-gold font-bold">
                  {problem.exampleAnswer2}
                </p>
              </div>
            )}

            {VisualizationComponent && createElement(VisualizationComponent, { year, day })}

            <div className="bg-bg-highlight rounded-xl p-4 border border-grid-line">
              <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-1 h-3 bg-accent-purple rounded-full" />
                Solution File
              </h4>
              <code className="font-mono text-accent-purple bg-bg-dark px-3 py-2 rounded-lg block mb-4">
                {year}/{dayPadded}/index.ts → solve2()
              </code>
              {!isLoadingCode && code2 && (
                <div className="mt-4">
                  <CodeSnippet code={code2} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
