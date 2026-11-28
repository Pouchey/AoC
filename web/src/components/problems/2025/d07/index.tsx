import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import { GridCanvas } from '../../viz/GridCanvas';
import type { VizProps } from '../../viz/types';
import { trace } from './trace';

export default function Day07(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={12}
      caption={
        props.part === 1
          ? 'The beam falls from S; every splitter (^) it reaches sends it left and right. Count the splitters that are hit.'
          : 'Quantum version: each split doubles the timelines. Brighter cells carry more timelines (log scale).'
      }
      render={(frame) => {
        const max = Math.max(1, ...frame.beams[frame.row].values());
        return (
          <div className="space-y-3">
            <Stats>
              <Stat label="Row" value={frame.row} />
              <Stat label="Splits" value={frame.splits} color={C.gold} />
              {props.part === 2 && (
                <Stat label="Timelines" value={frame.timelines} color={C.blue} />
              )}
            </Stats>
            <GridCanvas
              rows={frame.grid.length}
              cols={frame.grid[0].length}
              color={(r, c) => {
                const ch = frame.grid[r][c];
                if (ch === 'S') return C.green;
                if (r <= frame.row) {
                  const n = frame.beams[r].get(c);
                  if (n) {
                    if (props.part === 1) return C.blue;
                    const level = 0.25 + 0.75 * (Math.log(n + 1) / Math.log(max + 1));
                    return `rgba(79, 216, 255, ${Math.min(1, level)})`;
                  }
                }
                return ch === '^' ? C.gold : C.cell;
              }}
            />
          </div>
        );
      }}
    />
  );
}
