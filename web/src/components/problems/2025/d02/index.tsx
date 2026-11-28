import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace } from './trace';

export default function Day02(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={3}
      caption={
        props.part === 1
          ? 'For each range, the invalid IDs are those made of a digit sequence repeated exactly twice.'
          : 'Now any sequence repeated at least twice is invalid (12341234, 123123123, 1111111…).'
      }
      render={(frame, t, index) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Range" value={`${frame.range[0]}–${frame.range[1]}`} />
            <Stat label="Invalid here" value={frame.found.length} color={C.red} />
            <Stat label="Running sum" value={frame.sum} color={C.gold} />
          </Stats>
          <div className="flex flex-wrap gap-1.5">
            {t.frames.map((f, i) => (
              <span
                key={i}
                className="font-mono text-xs px-1.5 py-0.5 rounded border"
                style={{
                  borderColor: i === index ? C.blue : C.line,
                  color: i < index ? C.muted : i === index ? C.text : C.line,
                  background: f.found.length && i <= index ? '#f8514922' : undefined
                }}
              >
                {f.range[0]}-{f.range[1]}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 min-h-10">
            {frame.found.length === 0 && (
              <span className="text-sm text-text-secondary">No invalid ID in this range</span>
            )}
            {frame.found.slice(0, 60).map(({ id, pattern }) => (
              <span
                key={id}
                className="font-mono text-lg bg-bg-panel rounded-md px-2 py-1 border border-grid-line"
              >
                {String(id)
                  .match(new RegExp(`.{${pattern.length}}`, 'g'))!
                  .map((chunk, i) => (
                    <span key={i} style={{ color: i % 2 ? C.gold : C.red }}>
                      {chunk}
                    </span>
                  ))}
              </span>
            ))}
            {frame.found.length > 60 && (
              <span className="text-sm text-text-secondary">+{frame.found.length - 60} more</span>
            )}
          </div>
        </div>
      )}
    />
  );
}
