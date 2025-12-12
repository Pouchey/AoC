import type { TGrid } from '@aoc/utils/grid';
import type { TShape } from '@aoc/utils/shape';

export type TRegion = {
  grid: TGrid<boolean>;
  gifts: TShape[];
};

export type TXmasTree = {
  gifts: TShape[];
  regions: TRegion[];
};

export type AlgorithmStep = {
  regionIndex: number;
  grid: TGrid<boolean>;
  currentGiftIndex: number;
  totalGifts: number;
  status: 'placing' | 'backtracking' | 'success' | 'failed';
  message: string;
};

