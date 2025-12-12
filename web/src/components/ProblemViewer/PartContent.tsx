import { createElement } from 'react';
import type { Problem } from '../../types';
import { getProblemVisualization } from '../problems/visualizations';
import { ExampleAnswerCard } from './ExampleAnswerCard';
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
  const VisualizationComponent = getProblemVisualization(year, day, part === 1 ? 'part1' : 'part2');

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {description ? (
        <div className="prose max-w-none">
          <p className="text-text-primary leading-relaxed">{description}</p>
        </div>
      ) : (
        <p className="text-text-secondary italic">No description available for Part {part}</p>
      )}

      {exampleAnswer !== undefined && <ExampleAnswerCard answer={exampleAnswer} />}

      {VisualizationComponent && createElement(VisualizationComponent, { year, day })}

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
