import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import { GridCanvas } from '../../viz/GridCanvas';
import type { VizProps } from '../../viz/types';
import { trace } from './trace';

export default function Day23(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={4}
      caption={
        props.part === 1
          ? 'Corridors are compressed into edges between junctions (purple), then a DFS tries every hike; slopes are one-way. Each frame is a new longest hike (gold).'
          : 'Without slopes the graph is undirected: the same DFS explores far more paths before finding the longest one.'
      }
      render={(frame) => {
        const W = frame.grid[0].length;
        const path = new Set(frame.path);
        const junctions = new Set(frame.junctions);
        return (
          <div className="space-y-3">
            <Stats>
              <Stat label="Hikes finished" value={frame.explored} />
              <Stat label="Longest" value={frame.length} color={C.gold} />
            </Stats>
            <GridCanvas
              rows={frame.grid.length}
              cols={W}
              color={(r, c) => {
                const k = r * W + c;
                if (junctions.has(k)) return C.purple;
                if (path.has(k)) return C.gold;
                const ch = frame.grid[r][c];
                return ch === '#' ? '#0f2a17' : ch === '.' ? C.cell : C.blue;
              }}
            />
          </div>
        );
      }}
    />
  );
}
