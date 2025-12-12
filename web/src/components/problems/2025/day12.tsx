import { useState, useEffect, startTransition } from 'react';
import type { TXmasTree } from './day12/types.js';
import exampleData from '@aoc/2025/12/data/example?raw';
import inputData from '@aoc/2025/12/data/input?raw';
import { loadDataAsync } from './day12/utils.js';
import { GiftShapes } from './day12/GiftShapes.jsx';
import { RegionCard } from './day12/RegionCard.jsx';
import { DataSelector } from './day12/DataSelector.jsx';
import { RunAllOverlay } from './day12/RunAllOverlay.jsx';
import { useAlgorithm } from './day12/useAlgorithm.js';
import { useRunAll } from './day12/useRunAll.js';

export function Day12Visualization() {
  const [dataSource, setDataSource] = useState<'example' | 'input'>('example');
  const [maxRegionsToShow, setMaxRegionsToShow] = useState(5);
  const [data, setData] = useState<TXmasTree | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [regionResults, setRegionResults] = useState<Map<number, boolean>>(new Map());
  const { isRunning, currentStep, selectedRegionIndex, startAlgorithm, stopAlgorithm } =
    useAlgorithm();

  const {
    isRunning: isRunningAll,
    progress: runAllProgress,
    elapsedTime,
    runAll: runAllRegions,
    stop: stopRunAll
  } = useRunAll(data);

  // Load data asynchronously
  useEffect(() => {
    const rawData = dataSource === 'example' ? exampleData : inputData;

    // Set loading state immediately but don't block
    startTransition(() => {
      setIsLoading(true);
      setData(null);
      setRegionResults(new Map());
    });

    // Load data asynchronously in chunks - use setTimeout to ensure it's truly async
    setTimeout(() => {
      loadDataAsync(rawData).then((loadedData) => {
        startTransition(() => {
          setData(loadedData);
          setIsLoading(false);
        });
      });
    }, 0);
  }, [dataSource]);

  // Update region result when algorithm completes
  useEffect(() => {
    if (!isRunning && selectedRegionIndex !== null && currentStep) {
      if (currentStep.status === 'success') {
        startTransition(() => {
          setRegionResults((prev) => {
            const next = new Map(prev);
            next.set(selectedRegionIndex, true);
            return next;
          });
        });
      } else if (currentStep.status === 'failed') {
        startTransition(() => {
          setRegionResults((prev) => {
            const next = new Map(prev);
            next.set(selectedRegionIndex, false);
            return next;
          });
        });
      }
    }
  }, [isRunning, selectedRegionIndex, currentStep]);

  // Handle run all with callback to update results
  const handleRunAll = () => {
    if (isRunning) return;
    runAllRegions((regionIndex, canFit) => {
      setRegionResults((prev) => {
        const next = new Map(prev);
        next.set(regionIndex, canFit);
        return next;
      });
    });
  };

  if (!data) {
    return null;
  }

  const displayRegions = data.regions.slice(0, maxRegionsToShow);
  const hasMore = data.regions.length > maxRegionsToShow;

  // Show loading state but don't block the page
  if (isLoading || !data) {
    return (
      <div className="bg-bg-highlight rounded-xl p-6 border border-grid-line">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <span className="w-1 h-3 bg-accent-green rounded-full" />
            Visualization
          </h4>
          <DataSelector dataSource={dataSource} onSelect={setDataSource} />
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue mx-auto mb-4" />
            <p className="text-text-secondary">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <RunAllOverlay
        isVisible={isRunningAll}
        current={runAllProgress.current}
        total={runAllProgress.total}
        elapsedTime={elapsedTime}
        onStop={stopRunAll}
      />
      <div className="bg-bg-highlight rounded-xl p-6 border border-grid-line space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <span className="w-1 h-3 bg-accent-green rounded-full" />
            Visualization
          </h4>
          <DataSelector dataSource={dataSource} onSelect={setDataSource} />
        </div>

        <GiftShapes gifts={data.gifts} />

        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-text-primary">
              Regions ({data.regions.length} total)
            </h5>
            {!isRunningAll && !isRunning && dataSource === 'input' && (
              <button
                onClick={handleRunAll}
                className="px-4 py-2 bg-accent-green text-white rounded-lg text-sm font-medium hover:bg-accent-green/80 transition-colors"
              >
                ▶ Run All
              </button>
            )}
            {isRunningAll && (
              <button
                onClick={stopRunAll}
                className="px-4 py-2 bg-accent-red text-white rounded-lg text-sm font-medium hover:bg-accent-red/80 transition-colors"
              >
                ⏹ Stop All
              </button>
            )}
          </div>
          <div className="space-y-4">
            {displayRegions.map((region, regionIdx) => {
              const giftCounts = new Map<number, number>();
              data.gifts.forEach((_: boolean[][], idx: number) => {
                const count = region.gifts.filter((g: boolean[][]) => g === data.gifts[idx]).length;
                if (count > 0) giftCounts.set(idx, count);
              });

              const isSelected = selectedRegionIndex === regionIdx;
              const isActive = isSelected && isRunning;
              const displayGrid = isActive && currentStep ? currentStep.grid : region.grid;
              const canFit = regionResults.get(regionIdx);

              return (
                <RegionCard
                  key={regionIdx}
                  region={region}
                  regionIndex={regionIdx}
                  canFit={canFit}
                  giftCounts={giftCounts}
                  isSelected={isSelected}
                  isActive={isActive}
                  isRunning={isRunning || isRunningAll}
                  currentStep={currentStep}
                  displayGrid={displayGrid}
                  onRun={() => startAlgorithm(regionIdx, region)}
                  onStop={stopAlgorithm}
                />
              );
            })}
          </div>
          {hasMore && (
            <button
              onClick={() => setMaxRegionsToShow((prev) => prev + 5)}
              className="mt-4 w-full px-4 py-2 bg-bg-panel border border-grid-line rounded-lg text-text-secondary hover:text-text-primary hover:border-accent-blue/50 transition-colors text-sm font-medium"
            >
              Show More ({data.regions.length - maxRegionsToShow} remaining)
            </button>
          )}
        </div>
      </div>
    </>
  );
}
