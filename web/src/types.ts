export interface Problem {
  year: number;
  day: number;
  title?: string;
  part1Description?: string;
  part2Description?: string;
  solution1?: string;
  solution2?: string;
  exampleAnswer1?: number | string;
  exampleAnswer2?: number | string;
  firstPartCompleted?: boolean;
  secondPartCompleted?: boolean;
}

export interface YearData {
  year: number;
  days: number[];
}
