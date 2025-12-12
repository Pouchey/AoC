import { useState, useRef, useCallback } from 'react';
import type { TGrid } from '@aoc/utils/grid';
import type { TShape } from '@aoc/utils/shape';
import type { TXmasTree } from './types';
import { countShapeCells, generateAllVariants, canPlaceShapeAt } from '@aoc/utils/shape';
import { placeShape, removeShape } from './utils';
import { startTransition } from 'react';

interface RunAllState {
  isRunning: boolean;
  progress: { current: number; total: number };
  elapsedTime: number;
}

export function useRunAll(data: TXmasTree | null) {
  const [state, setState] = useState<RunAllState>({
    isRunning: false,
    progress: { current: 0, total: 0 },
    elapsedTime: 0
  });

  const isRunningRef = useRef(false);
  const timerIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    setState((prev) => ({ ...prev, elapsedTime: 0 }));

    timerIntervalRef.current = window.setInterval(() => {
      if (startTimeRef.current && isRunningRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setState((prev) => ({ ...prev, elapsedTime: elapsed }));
      }
    }, 100);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    startTimeRef.current = null;
    setState((prev) => ({ ...prev, elapsedTime: 0 }));
  }, []);

  // Interruptible version of backtrackShape that checks shouldStop frequently
  const backtrackShapeInterruptible = useCallback(
    (grid: TGrid<boolean>, shapes: TShape[], shouldStop: () => boolean): boolean => {
      // Check for stop at the start
      if (shouldStop()) return false;

      if (shapes.length === 0) return true;

      // Quick check: count available space
      const totalNeeded = shapes.reduce((sum, s) => sum + countShapeCells(s), 0);
      const available = grid.reduce((sum, row) => sum + row.filter((cell) => !cell).length, 0);
      if (available < totalNeeded) return false;

      const shape = shapes[0];
      const variants = generateAllVariants(shape);
      const rowLength = grid.length;
      const colLength = grid[0].length;

      for (const variant of variants) {
        // Check for stop before each variant
        if (shouldStop()) return false;

        const shapeLength = variant.length;
        const shapeWidth = variant[0].length;

        if (shapeLength > rowLength || shapeWidth > colLength) continue;

        for (let y = 0; y <= rowLength - shapeLength; y++) {
          // Check for stop before each row
          if (shouldStop()) return false;

          for (let x = 0; x <= colLength - shapeWidth; x++) {
            // Check for stop before each position
            if (shouldStop()) return false;

            if (canPlaceShapeAt(variant, grid, x, y)) {
              placeShape(variant, grid, x, y);

              // Recursive call with stop check
              if (backtrackShapeInterruptible(grid, shapes.slice(1), shouldStop)) {
                return true;
              }

              removeShape(variant, grid, x, y);
            }
          }
        }
      }
      return false;
    },
    []
  );

  const runAll = useCallback(
    async (onProgress: (regionIndex: number, canFit: boolean) => void) => {
      if (!data || isRunningRef.current) return;

      isRunningRef.current = true;
      setState({
        isRunning: true,
        progress: { current: 0, total: data.regions.length },
        elapsedTime: 0
      });
      startTimer();

      for (let i = 0; i < data.regions.length; i++) {
        if (!isRunningRef.current) break;

        const region = data.regions[i];
        const sortedGifts = [...region.gifts].sort(
          (a, b) => countShapeCells(b) - countShapeCells(a)
        );
        const testGrid: TGrid<boolean> = region.grid.map((row: boolean[]) => [...row]);

        // Use interruptible version that checks shouldStop frequently
        const canFit = backtrackShapeInterruptible(
          testGrid,
          sortedGifts,
          () => !isRunningRef.current
        );

        // Check again after algorithm completes
        if (!isRunningRef.current) break;

        onProgress(i, canFit);

        startTransition(() => {
          setState((prev) => ({
            ...prev,
            progress: { current: i + 1, total: data.regions.length }
          }));
        });

        // Yield to browser every 5 regions to allow UI updates
        if (i % 5 === 0 && i < data.regions.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }

      stopTimer();
      isRunningRef.current = false;
      setState({
        isRunning: false,
        progress: { current: 0, total: 0 },
        elapsedTime: 0
      });
    },
    [data, startTimer, stopTimer, backtrackShapeInterruptible]
  );

  const stop = useCallback(() => {
    isRunningRef.current = false;
    stopTimer();
    setState({
      isRunning: false,
      progress: { current: 0, total: 0 },
      elapsedTime: 0
    });
  }, [stopTimer]);

  return {
    isRunning: state.isRunning,
    progress: state.progress,
    elapsedTime: state.elapsedTime,
    runAll,
    stop
  };
}
