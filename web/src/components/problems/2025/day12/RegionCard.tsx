import type { TRegion, AlgorithmStep } from './types';

interface RegionCardProps {
  region: TRegion;
  regionIndex: number;
  canFit: boolean | undefined;
  giftCounts: Map<number, number>;
  isSelected: boolean;
  isActive: boolean;
  isRunning: boolean;
  currentStep: AlgorithmStep | null;
  displayGrid: boolean[][];
  onRun: () => void;
  onStop: () => void;
}

export function RegionCard({
  region,
  regionIndex,
  canFit,
  giftCounts,
  isSelected,
  isActive,
  isRunning,
  currentStep,
  displayGrid,
  onRun,
  onStop
}: RegionCardProps) {
  const width = region.grid[0]?.length || 0;
  const height = region.grid.length;

  return (
    <div
      className={`bg-bg-panel rounded-lg p-4 border ${
        isSelected ? 'border-accent-blue border-2' : 'border-grid-line'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-text-primary">
            Region {regionIndex + 1}: {width}x{height}
          </div>
          <div className="text-xs text-text-secondary mt-1">
            Gifts needed:{' '}
            {Array.from(giftCounts.entries())
              .map(([idx, count]) => `Shape ${idx}×${count}`)
              .join(', ')}
          </div>
          {isActive && currentStep && (
            <div className="text-xs mt-2 min-h-12">
              <div
                className={`inline-block px-2 py-1 rounded ${
                  currentStep.status === 'placing'
                    ? 'bg-accent-blue/20 text-accent-blue'
                    : currentStep.status === 'backtracking'
                      ? 'bg-accent-gold/20 text-accent-gold'
                      : currentStep.status === 'success'
                        ? 'bg-accent-green/20 text-accent-green'
                        : 'bg-accent-red/20 text-accent-red'
                }`}
              >
                {currentStep.status === 'placing'
                  ? `Placing gift ${currentStep.currentGiftIndex + 1}/${currentStep.totalGifts + 1}`
                  : currentStep.status === 'backtracking'
                    ? 'Backtracking...'
                    : currentStep.message}
              </div>
              {currentStep.status === 'placing' && (
                <div className="text-text-secondary mt-1 font-mono">
                  {currentStep.currentGiftIndex + 1}/{currentStep.totalGifts + 1}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isActive && (
            <button
              onClick={onRun}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isRunning
                  ? 'bg-bg-panel text-text-secondary border border-grid-line cursor-not-allowed opacity-50'
                  : 'bg-accent-blue text-white hover:bg-accent-blue/80'
              }`}
            >
              ▶ Run
            </button>
          )}
          {isActive && (
            <button
              onClick={onStop}
              className="px-3 py-1.5 bg-accent-red text-white rounded-lg text-xs font-medium hover:bg-accent-red/80 transition-colors"
            >
              ⏹ Stop
            </button>
          )}
          {canFit !== undefined && (
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                canFit
                  ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                  : 'bg-accent-red/20 text-accent-red border border-accent-red/30'
              }`}
            >
              {canFit ? '✓ Fits' : '✗ Cannot Fit'}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        {displayGrid.map((row: boolean[], rowIdx: number) => (
          <div key={rowIdx} className="flex gap-0.5">
            {row.map((cell: boolean, colIdx: number) => (
              <div
                key={colIdx}
                className={`w-3 h-3 rounded border transition-colors ${
                  cell
                    ? isActive
                      ? 'bg-accent-blue border-accent-blue animate-pulse'
                      : 'bg-accent-blue/30 border-accent-blue/50'
                    : 'bg-bg-dark border-grid-line'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
