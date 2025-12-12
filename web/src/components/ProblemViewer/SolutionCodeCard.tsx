import { CodeSnippet } from '../CodeSnippet';
import { LoadingCard } from './LoadingCard';

interface SolutionCodeCardProps {
  year: number;
  day: number;
  part: 1 | 2;
  code: string | null;
  loadDataCode: string | null;
  isLoading: boolean;
}

export function SolutionCodeCard({
  year,
  day,
  part,
  code,
  loadDataCode,
  isLoading
}: SolutionCodeCardProps) {
  const dayPadded = day.toString().padStart(2, '0');
  const accentColor = part === 1 ? 'accent-blue' : 'accent-purple';
  const functionName = part === 1 ? 'solve1()' : 'solve2()';

  return (
    <div className="bg-bg-highlight rounded-xl p-4 border border-grid-line w-full max-w-full overflow-hidden">
      <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
        <span
          className={`w-1 h-3 rounded-full ${part === 1 ? 'bg-accent-blue' : 'bg-accent-purple'}`}
        />
        Solution File
      </h4>
      <code
        className={`font-mono bg-bg-dark px-3 py-2 rounded-lg block mb-4 overflow-x-auto ${
          part === 1 ? 'text-accent-blue' : 'text-accent-purple'
        }`}
      >
        {year}/{dayPadded}/index.ts → {functionName}
      </code>
      {isLoading ? (
        <LoadingCard accentColor={accentColor as 'accent-blue' | 'accent-purple'} />
      ) : (
        <div className="space-y-4">
          {loadDataCode && (
            <div>
              <div className="mb-2">
                <code
                  className={`font-mono text-xs ${
                    part === 1 ? 'text-accent-blue/70' : 'text-accent-purple/70'
                  }`}
                >
                  loadData()
                </code>
              </div>
              <CodeSnippet code={loadDataCode} />
            </div>
          )}
          {code && (
            <div>
              {loadDataCode && (
                <div className="mb-2">
                  <code
                    className={`font-mono text-xs ${
                      part === 1 ? 'text-accent-blue/70' : 'text-accent-purple/70'
                    }`}
                  >
                    {functionName}
                  </code>
                </div>
              )}
              <CodeSnippet code={code} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
