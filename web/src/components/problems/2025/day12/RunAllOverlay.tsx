import { createPortal } from 'react-dom';

interface RunAllOverlayProps {
  isVisible: boolean;
  current: number;
  total: number;
  elapsedTime: number;
  onStop: () => void;
}

export function RunAllOverlay({
  isVisible,
  current,
  total,
  elapsedTime,
  onStop
}: RunAllOverlayProps) {
  if (!isVisible) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = total > 0 ? (current / total) * 100 : 0;

  const overlay = (
    <div
      className="fixed inset-0 bg-bg-highlight/95 backdrop-blur-sm z-99999 flex items-center justify-center"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-bg-panel rounded-lg p-6 border border-grid-line shadow-lg max-w-md w-full mx-4">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue" />
          <div className="text-center w-full">
            <p className="text-text-primary font-semibold mb-2">Processing all regions...</p>
            <p className="text-text-secondary text-sm mb-1">
              {current} / {total} regions completed
            </p>
            <p className="text-text-secondary text-xs mb-4">
              Time elapsed: {formatTime(elapsedTime)}
            </p>
            <div className="w-full bg-bg-dark rounded-full h-3 mb-4">
              <div
                className="bg-accent-blue h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`
                }}
              />
            </div>
            <button
              onClick={onStop}
              className="px-4 py-2 bg-accent-red text-white rounded-lg text-sm font-medium hover:bg-accent-red/80 transition-colors"
            >
              ⏹ Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
