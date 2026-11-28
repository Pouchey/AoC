import type { Problem } from '../../types';
import { renderVisualization } from '../problems/visualizations';
import { SolutionCodeCard } from './SolutionCodeCard';

interface PartContentProps {
  year: number;
  day: number;
  problem: Problem;
  part: 1 | 2;
  code: string | null;
  loadDataCode: string | null;
  isLoadingCode: boolean;
}

export function PartContent({
  year,
  day,
  problem,
  part,
  code,
  loadDataCode,
  isLoadingCode
}: PartContentProps) {
  const description = part === 1 ? problem.part1Description : problem.part2Description;
  const exampleAnswer = part === 1 ? problem.exampleAnswer1 : problem.exampleAnswer2;

  return (
    <div className="mt-6 space-y-10 min-w-0">
      <div className="max-w-[68ch] space-y-3">
        <p className="text-text-primary/90 leading-relaxed">
          {description ?? 'No summary written for this part yet.'}
        </p>
        {exampleAnswer !== undefined && (
          <p className="text-sm text-text-secondary">
            Answer on the example: <span className="text-text-primary">{exampleAnswer}</span>
          </p>
        )}
      </div>

      {renderVisualization(year, day, part)}

      <SolutionCodeCard
        year={year}
        day={day}
        part={part}
        code={code}
        loadDataCode={loadDataCode}
        isLoading={isLoadingCode}
      />
    </div>
  );
}
