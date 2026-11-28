import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace } from './trace';

export default function Day09(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={2}
      caption={
        props.part === 1
          ? 'Take differences until they are all zero, then rebuild the next value from the bottom up (gold).'
          : 'Same pyramid, but extrapolating backwards: the new value is added on the left.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="History" value={frame.index + 1} />
            <Stat label="Extrapolated" value={frame.value} color={C.gold} />
            <Stat label="Sum" value={frame.sum} color={C.green} />
          </Stats>
          <div className="overflow-x-auto bg-bg-dark rounded-lg border border-grid-line p-3">
            {frame.rows.map((row, r) => (
              <div
                key={r}
                className="flex gap-1 font-mono text-xs whitespace-nowrap"
                style={{ paddingLeft: r * 22 }}
              >
                {row.map((v, i) => {
                  const added = props.part === 1 ? i === row.length - 1 : i === 0;
                  return (
                    <span
                      key={i}
                      className="min-w-10 text-center px-1 py-0.5 rounded"
                      style={{
                        color: added ? C.gold : v === 0 ? C.line : C.text,
                        background: added ? '#ffd16622' : undefined
                      }}
                    >
                      {v}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
