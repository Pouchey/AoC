import type { Problem, YearData } from '../types';

export interface ProblemsData {
  years: YearData[];
  problems: Record<string, Problem>;
}

let cachedData: ProblemsData | null = null;

export async function loadProblemsData(): Promise<ProblemsData> {
  if (cachedData) return cachedData;

  const response = await fetch('/problems.json');
  cachedData = await response.json();
  return cachedData!;
}

export function getProblem(data: ProblemsData, year: number, day: number): Problem | undefined {
  return data.problems[`${year}-${day.toString().padStart(2, '0')}`];
}

export function getYearData(data: ProblemsData, year: number): YearData | undefined {
  return data.years.find((y) => y.year === year);
}
