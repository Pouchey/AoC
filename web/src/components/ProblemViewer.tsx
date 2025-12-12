import { useState } from 'react';
import { getProblem, type ProblemsData } from '../data/problems';
import { ProblemHeader } from './ProblemViewer/ProblemHeader';
import { ProblemTabs } from './ProblemViewer/ProblemTabs';
import { PartContent } from './ProblemViewer/PartContent';
import { useSolutionCode } from './ProblemViewer/useSolutionCode';

interface ProblemViewerProps {
  data: ProblemsData;
  year: number;
  day: number;
}

export function ProblemViewer({ data, year, day }: ProblemViewerProps) {
  const [activeTab, setActiveTab] = useState<'part1' | 'part2'>('part1');
  const { code1, code2, loadDataCode, isLoadingCode } = useSolutionCode(year, day);
  const problem = getProblem(data, year, day);

  if (!problem) {
    return (
      <div className="bg-bg-panel rounded-2xl p-8 border border-grid-line text-center">
        <p className="text-text-secondary">Problem not found</p>
      </div>
    );
  }

  const currentCode = activeTab === 'part1' ? code1 : code2;

  return (
    <div className="bg-bg-panel rounded-2xl border border-grid-line overflow-hidden">
      {/* Gradient top border */}
      <div className="h-1 bg-linear-to-r from-accent-red via-accent-green to-accent-blue" />

      <ProblemHeader year={year} day={day} problem={problem} />

      <ProblemTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="p-6 w-full max-w-full overflow-hidden">
        <PartContent
          year={year}
          day={day}
          problem={problem}
          part={activeTab === 'part1' ? 1 : 2}
          code={currentCode}
          loadDataCode={loadDataCode}
          isLoadingCode={isLoadingCode}
        />
      </div>
    </div>
  );
}
