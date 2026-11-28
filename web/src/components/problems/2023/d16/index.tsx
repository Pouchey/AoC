import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import { GridCanvas } from '../../viz/GridCanvas';
import type { VizProps } from '../../viz/types';
import { trace } from './trace';

export default function Day16(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={props.part === 1 ? 15 : 8}
      caption={
        props.part === 1
          ? 'The beam enters top-left going right; mirrors (/ \\) turn it, splitters (| -) split it. Energized tiles light up.'
          : 'Try every entry point on the edges and keep the configuration that energizes the most tiles.'
      }
      render={(frame) => {
        const W = frame.grid[0].length;
        return (
          <div className="space-y-3">
            <Stats>
              <Stat label="Start" value={frame.start} />
              <Stat label="Energized" value={frame.energized} color={C.gold} />
              {props.part === 2 && <Stat label="Best" value={frame.best} color={C.green} />}
            </Stats>
            <GridCanvas
              rows={frame.grid.length}
              cols={W}
              label={(r, c) => (frame.grid[r][c] === '.' ? null : frame.grid[r][c])}
              color={(r, c) => {
                const v = frame.time[r * W + c];
                if (v >= 0 && v <= frame.t)
                  return `hsl(${45 - (v / Math.max(1, frame.t)) * 30}, 90%, ${60 - (v / Math.max(1, frame.t)) * 15}%)`;
                return frame.grid[r][c] === '.' ? C.cell : C.muted;
              }}
            />
          </div>
        );
      }}
    />
  );
}
