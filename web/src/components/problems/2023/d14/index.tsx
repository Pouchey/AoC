import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import { GridCanvas } from '../../viz/GridCanvas';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function Loads({ frame, upTo }: { frame: Frame; upTo: number }) {
  const shown = frame.loads.slice(0, upTo);
  const max = Math.max(...frame.loads);
  const min = Math.min(...frame.loads);
  return (
    <div className="flex items-end gap-px h-20 bg-bg-dark rounded-lg border border-grid-line p-1">
      {shown.map((l, i) => {
        const inCycle = frame.cycle && i + 1 >= frame.cycle.start;
        return (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${10 + ((l - min) / (max - min || 1)) * 90}%`,
              background: inCycle ? C.purple : C.blue
            }}
          />
        );
      })}
    </div>
  );
}

export default function Day14(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={props.part === 1 ? 6 : 4}
      caption={
        props.part === 1
          ? 'Tilt north: round rocks (O) roll until they hit a cube rock (#) or the edge. Load = rocks weighted by distance to the south edge.'
          : 'A spin cycle tilts north, west, south, east. The platform soon repeats (purple), so cycle 1,000,000,000 is found by modulo.'
      }
      render={(frame, _t, index) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Step" value={frame.label} />
            <Stat label="Load" value={frame.load} color={C.gold} />
            {frame.cycle && <Stat label="Period" value={frame.cycle.length} color={C.purple} />}
          </Stats>
          <GridCanvas
            rows={frame.rows.length}
            cols={frame.rows[0].length}
            maxHeight={440}
            color={(r, c) => {
              const ch = frame.rows[r][c];
              return ch === 'O' ? C.blue : ch === '#' ? C.muted : C.cell;
            }}
          />
          {props.part === 2 && <Loads frame={frame} upTo={index + 1} />}
        </div>
      )}
    />
  );
}
