import type { useStepper } from './useStepper';

const SPEEDS = [1, 2, 4, 8, 15, 30, 60, 120, 240];

export function Player({
  stepper,
  count
}: {
  stepper: ReturnType<typeof useStepper>;
  count: number;
}) {
  const { index, playing, fps, setFps, toggle, seek, step } = stepper;
  const button =
    'px-2.5 py-1 rounded-md text-sm bg-bg-dark text-text-primary hover:bg-bg-highlight disabled:opacity-30';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={button} onClick={() => seek(0)} disabled={index === 0} title="First">
        ⏮
      </button>
      <button className={button} onClick={() => step(-1)} disabled={index === 0} title="Previous">
        ◀
      </button>
      <button
        className={`${button} min-w-20 !text-accent-blue`}
        onClick={toggle}
        disabled={count <= 1}
      >
        {playing ? 'Pause' : 'Play'}
      </button>
      <button className={button} onClick={() => step(1)} disabled={index >= count - 1} title="Next">
        ▶
      </button>
      <button
        className={button}
        onClick={() => seek(count - 1)}
        disabled={index >= count - 1}
        title="Last"
      >
        ⏭
      </button>
      <input
        type="range"
        min={0}
        max={Math.max(0, count - 1)}
        value={index}
        onChange={(e) => seek(Number(e.target.value))}
        className="flex-1 min-w-32 accent-accent-blue"
        aria-label="Frame"
      />
      <span className="text-xs text-text-secondary tabular-nums">
        {index + 1}/{count}
      </span>
      <select
        value={fps}
        onChange={(e) => setFps(Number(e.target.value))}
        className="bg-bg-dark rounded-md text-sm px-1.5 py-1"
        aria-label="Speed"
      >
        {[...new Set([...SPEEDS, fps])]
          .sort((a, b) => a - b)
          .map((s) => (
            <option key={s} value={s}>
              {s} fps
            </option>
          ))}
      </select>
    </div>
  );
}
