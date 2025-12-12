import { useState, useRef } from 'react';
import type { TGrid } from '@aoc/utils/grid';
import type { TShape } from '@aoc/utils/shape';
import { generateAllVariants, canPlaceShapeAt } from '@aoc/utils/shape';
import { placeShape, removeShape } from './utils';
import type { AlgorithmStep } from './types';

export function useAlgorithm() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number | null>(null);
  const isRunningRef = useRef(false);

  const backtrackWithSteps = async (
    grid: TGrid<boolean>,
    shapes: TShape[],
    regionIndex: number,
    currentGiftIndex: number,
    onStep: (step: AlgorithmStep) => void
  ): Promise<boolean> => {
    if (shapes.length === 0) {
      onStep({
        regionIndex,
        grid: grid.map((row) => [...row]),
        currentGiftIndex: currentGiftIndex - 1,
        totalGifts: currentGiftIndex,
        status: 'success',
        message: 'All gifts placed successfully!'
      });
      return true;
    }

    const shape = shapes[0];
    const variants = generateAllVariants(shape);
    const rowLength = grid.length;
    const colLength = grid[0].length;

    for (const variant of variants) {
      const shapeLength = variant.length;
      const shapeWidth = variant[0].length;

      if (shapeLength > rowLength || shapeWidth > colLength) continue;

      for (let y = 0; y <= rowLength - shapeLength; y++) {
        for (let x = 0; x <= colLength - shapeWidth; x++) {
          if (!isRunningRef.current) return false;

          if (canPlaceShapeAt(variant, grid, x, y)) {
            placeShape(variant, grid, x, y);
            onStep({
              regionIndex,
              grid: grid.map((row) => [...row]),
              currentGiftIndex,
              totalGifts: currentGiftIndex + shapes.length - 1,
              status: 'placing',
              message: `Placing gift ${currentGiftIndex + 1}/${currentGiftIndex + shapes.length}`
            });

            await new Promise((resolve) => setTimeout(resolve, 100));

            if (
              await backtrackWithSteps(
                grid,
                shapes.slice(1),
                regionIndex,
                currentGiftIndex + 1,
                onStep
              )
            ) {
              return true;
            }

            removeShape(variant, grid, x, y);
            onStep({
              regionIndex,
              grid: grid.map((row) => [...row]),
              currentGiftIndex,
              totalGifts: currentGiftIndex + shapes.length - 1,
              status: 'backtracking',
              message: 'Backtracking...'
            });

            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        }
      }
    }

    return false;
  };

  const startAlgorithm = async (
    regionIndex: number,
    region: { grid: TGrid<boolean>; gifts: TShape[] }
  ) => {
    if (isRunning) return;

    setIsRunning(true);
    isRunningRef.current = true;
    setSelectedRegionIndex(regionIndex);
    setCurrentStep(null);

    const sortedGifts = [...region.gifts].sort((a, b) => {
      const aCount = a.flat().filter(Boolean).length;
      const bCount = b.flat().filter(Boolean).length;
      return bCount - aCount;
    });
    const testGrid: TGrid<boolean> = region.grid.map((row: boolean[]) => [...row]);

    try {
      const result = await backtrackWithSteps(testGrid, sortedGifts, regionIndex, 0, (step) => {
        if (isRunningRef.current) {
          setCurrentStep(step);
        }
      });

      // Update final status based on result
      if (!result && isRunningRef.current) {
        setCurrentStep({
          regionIndex,
          grid: testGrid.map((row) => [...row]),
          currentGiftIndex: 0,
          totalGifts: sortedGifts.length,
          status: 'failed',
          message: 'Cannot fit all gifts'
        });
      }
    } finally {
      setIsRunning(false);
      isRunningRef.current = false;
    }
  };

  const stopAlgorithm = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    setCurrentStep(null);
    setSelectedRegionIndex(null);
  };

  return {
    isRunning,
    currentStep,
    selectedRegionIndex,
    startAlgorithm,
    stopAlgorithm
  };
}
