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
      <p className="mt-16 text-text-secondary">
        No puzzle recorded for day {day} of {year}.
      </p>
    );
  }

  return (
    <article className="mt-16">
      <ProblemHeader year={year} day={day} problem={problem} />
      <ProblemTabs activeTab={activeTab} onTabChange={setActiveTab} problem={problem} />
      <PartContent
        year={year}
        day={day}
        problem={problem}
        part={activeTab === 'part1' ? 1 : 2}
        code={activeTab === 'part1' ? code1 : code2}
        loadDataCode={loadDataCode}
        isLoadingCode={isLoadingCode}
      />
    </article>
  );
}
