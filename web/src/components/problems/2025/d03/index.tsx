import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace } from './trace';

export default function Day03(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={2}
      caption={`Each bank turns on ${props.part === 1 ? 2 : 12} batteries, in order, to make the largest number: greedily take the biggest digit that still leaves room for the rest.`}
      render={(frame, t) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Bank" value={`${frame.index + 1}/${t.frames.length}`} />
            <Stat label="Joltage" value={frame.joltage} color={C.gold} />
            <Stat label="Total" value={frame.total} color={C.green} />
          </Stats>
          <div className="flex flex-wrap gap-1 font-mono">
            {frame.bank.split('').map((digit, i) => {
              const on = frame.picked.includes(i);
              return (
                <span
                  key={i}
                  className="w-6 h-8 flex items-center justify-center rounded text-sm"
                  style={{
                    background: on ? '#ffd16633' : C.panel,
                    color: on ? C.gold : C.muted,
                    border: `1px solid ${on ? C.gold : C.line}`,
                    boxShadow: on ? `0 0 8px ${C.gold}55` : undefined
                  }}
                >
                  {digit}
                </span>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
