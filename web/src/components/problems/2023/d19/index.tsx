import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace } from './trace';

const KEYS = ['x', 'm', 'a', 's'] as const;

export default function Day19(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={2}
      caption={
        props.part === 1
          ? 'Each part goes through workflows from "in" until it is Accepted (sum of its ratings) or Rejected.'
          : 'All 4000⁴ combinations go through at once as a box of ranges, split at every condition; each accepted box adds its volume.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            {frame.rating && (
              <Stat label="Part" value={KEYS.map((k) => `${k}=${frame.rating![k]}`).join(' ')} />
            )}
            {frame.box && <Stat label="Combinations" value={frame.combos} color={C.blue} />}
            <Stat label="Total" value={frame.total} color={C.gold} />
          </Stats>
          <div className="flex flex-wrap items-center gap-1 font-mono text-sm">
            {frame.path.map((step, i) => (
              <span key={i} className="flex items-center gap-1">
                <span
                  className="px-2 py-1 rounded border"
                  style={{
                    borderColor: step === 'A' ? C.green : step === 'R' ? C.red : C.line,
                    color: step === 'A' ? C.green : step === 'R' ? C.red : C.text
                  }}
                >
                  {step}
                </span>
                {i < frame.path.length - 1 && <span className="text-text-secondary">→</span>}
              </span>
            ))}
          </div>
          {frame.box && (
            <div className="space-y-1.5">
              {KEYS.map((k) => {
                const [lo, hi] = frame.box![k];
                return (
                  <div key={k} className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-4">{k}</span>
                    <div className="relative flex-1 h-4 bg-bg-dark rounded border border-grid-line">
                      <div
                        className="absolute top-0 bottom-0 rounded"
                        style={{
                          left: `${((lo - 1) / 4000) * 100}%`,
                          width: `${((hi - lo + 1) / 4000) * 100}%`,
                          background: C.blue
                        }}
                      />
                    </div>
                    <span className="w-24 text-right text-text-secondary">
                      {lo}–{hi}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    />
  );
}
