import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import { GridCanvas } from '../../viz/GridCanvas';
import type { VizProps } from '../../viz/types';
import { trace } from './trace';

const BOX: Record<string, string> = { '|': '│', '-': '─', L: '└', J: '┘', '7': '┐', F: '┌' };

export default function Day10(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={props.part === 1 ? 20 : 15}
      caption={
        props.part === 1
          ? 'The loop is explored from S in both directions at once; the farthest point is half its length.'
          : 'Scanning each row, every crossing of a loop pipe going north toggles inside/outside: tiles inside are green.'
      }
      render={(frame) => {
        const W = frame.grid[0].length;
        return (
          <div className="space-y-3">
            <Stats>
              {props.part === 1 ? (
                <Stat label="Distance" value={frame.upTo} color={C.gold} />
              ) : (
                <Stat label="Enclosed tiles" value={frame.enclosed} color={C.green} />
              )}
              <Stat label="Loop length" value={frame.far * 2} />
            </Stats>
            <GridCanvas
              rows={frame.grid.length}
              cols={W}
              label={(r, c) => (frame.dist[r * W + c] >= 0 ? BOX[frame.grid[r][c]] : null)}
              color={(r, c) => {
                const d = frame.dist[r * W + c];
                if (d >= 0) {
                  if (props.part === 1 && d > frame.upTo) return C.cell;
                  if (props.part === 1 && d === frame.upTo) return C.gold;
                  return `hsl(${210 + (d / Math.max(1, frame.far)) * 90}, 70%, ${props.part === 1 ? 55 : 35}%)`;
                }
                if (props.part === 2 && r <= frame.upTo)
                  return frame.inside[r * W + c] ? C.green : '#121110';
                return C.cell;
              }}
            />
          </div>
        );
      }}
    />
  );
}
