import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import { GridCanvas } from '../../viz/GridCanvas';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function Schematic({ frame, part }: { frame: Frame; part: 1 | 2 }) {
  const { grid, numbers } = frame;
  const owner = new Map<number, number>();
  const W = grid[0].length;
  numbers.forEach((n, i) => {
    for (let k = 0; k < n.len; k++) owner.set(n.r * W + n.c + k, i);
  });
  const shownGears = part === 2 ? frame.gears.slice(0, frame.done) : [];
  const gearNums = new Set(shownGears.flatMap((g) => g.nums));
  const gearCells = new Set(shownGears.map((g) => g.r * W + g.c));
  const current = part === 2 ? frame.gears[frame.current] : undefined;

  return (
    <GridCanvas
      rows={grid.length}
      cols={W}
      label={(r, c) => (grid[r][c] === '.' ? null : grid[r][c])}
      color={(r, c) => {
        const ch = grid[r][c];
        const k = r * W + c;
        if (ch === '.') return C.cell;
        const i = owner.get(k);
        if (i === undefined) {
          if (current && current.r === r && current.c === c) return C.text;
          return gearCells.has(k) ? C.purple : '#f5c45199';
        }
        if (part === 1) {
          if (i === frame.current) return C.blue;
          if (i >= frame.done) return C.line;
          return numbers[i].part ? '#5fd39acc' : '#ff6b6baa';
        }
        if (current?.nums.includes(i)) return C.blue;
        return gearNums.has(i) ? '#5fd39acc' : C.line;
      }}
    />
  );
}

export default function Day03(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={10}
      caption={
        props.part === 1
          ? 'Numbers touching a symbol, even diagonally, are part numbers (green); the others are not (red).'
          : 'A gear is a * next to exactly two numbers (purple); its ratio is their product.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            {props.part === 1 ? (
              <Stat
                label="Number"
                value={frame.numbers[frame.current].value}
                color={frame.numbers[frame.current].part ? C.green : C.red}
              />
            ) : (
              frame.gears[frame.current] && (
                <Stat
                  label="Gear ratio"
                  value={frame.gears[frame.current].ratio}
                  color={C.purple}
                />
              )
            )}
            <Stat label="Sum" value={frame.total} color={C.gold} />
          </Stats>
          <Schematic frame={frame} part={props.part} />
        </div>
      )}
    />
  );
}
