import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace } from './trace';

export default function Day15(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={props.part === 1 ? 4 : 3}
      caption={
        props.part === 1
          ? 'HASH: for each character, add its ASCII code, ×17, modulo 256.'
          : 'The HASH of the label picks one of 256 boxes; "=" puts or replaces a lens, "-" removes it. Focusing power = box × slot × focal length.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Step" value={frame.step} color={C.blue} />
            <Stat label={props.part === 1 ? 'HASH' : 'Box'} value={frame.hash} />
            <Stat
              label={props.part === 1 ? 'Sum' : 'Focusing power'}
              value={frame.total}
              color={C.gold}
            />
          </Stats>
          {props.part === 2 && (
            <div className="flex flex-wrap gap-2">
              {frame.boxes.map(([box, lenses]) => (
                <div
                  key={box}
                  className="rounded-lg border px-2 py-1.5 bg-bg-panel"
                  style={{ borderColor: box === frame.hash ? C.gold : C.line }}
                >
                  <div className="text-xs text-text-secondary mb-1">Box {box}</div>
                  <div className="flex gap-1">
                    {lenses.map(([label, focal]) => (
                      <span
                        key={label}
                        className="font-mono text-xs px-1.5 py-0.5 rounded bg-bg-dark border border-grid-line"
                      >
                        {label} <b style={{ color: C.gold }}>{focal}</b>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    />
  );
}
