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
  const path = `${year}/${String(day).padStart(2, '0')}/index.ts`;
  const fn = `solve${part}`;

  return (
    <section className="min-w-0">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h3 className="text-lg font-normal">Solution</h3>
        <a
          href={`https://github.com/Pouchey/AoC/blob/main/${path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-text-secondary hover:text-accent-blue font-mono"
        >
          {path}
        </a>
      </div>
      {isLoading ? (
        <LoadingCard />
      ) : (
        <div className="mt-4 space-y-6">
          {loadDataCode && (
            <div>
              <p className="mb-2 text-sm text-text-secondary">Parsing the input</p>
              <CodeSnippet code={loadDataCode} />
            </div>
          )}
          {code && (
            <div>
              {loadDataCode && (
                <p className="mb-2 text-sm text-text-secondary">
                  Part {part} ({fn})
                </p>
              )}
              <CodeSnippet code={code} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
