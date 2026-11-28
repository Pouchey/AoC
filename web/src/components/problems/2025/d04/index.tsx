import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import { GridCanvas } from '../../viz/GridCanvas';
import type { VizProps } from '../../viz/types';
import { trace } from './trace';

export default function Day04(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={3}
      caption={
        props.part === 1
          ? 'Rolls (@) with fewer than 4 rolls among their 8 neighbours can be reached by a forklift (green).'
          : 'Remove every reachable roll, then look again: each frame is one wave of removals.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Wave" value={frame.wave} />
            <Stat label="Reachable now" value={frame.accessible.size} color={C.green} />
            <Stat label="Removed so far" value={frame.removed} color={C.gold} />
          </Stats>
          <GridCanvas
            rows={frame.rows.length}
            cols={frame.rows[0].length}
            color={(r, c) => {
              if (frame.accessible.has(r * frame.rows[0].length + c)) return C.green;
              const ch = frame.rows[r][c];
              return ch === '@' ? C.muted : ch === 'x' ? '#d2992240' : C.cell;
            }}
          />
        </div>
      )}
    />
  );
}
