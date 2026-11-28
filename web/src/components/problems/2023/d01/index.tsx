import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function Line({ frame }: { frame: Frame }) {
  const { line, first, last } = frame;
  const color = (i: number) => {
    if (first && i >= first.at && i < first.at + first.len) return C.green;
    if (last && i >= last.at && i < last.at + last.len) return C.gold;
    return C.muted;
  };
  return (
    <div className="font-mono text-2xl tracking-wider bg-bg-dark rounded-lg border border-grid-line px-4 py-6 text-center break-all">
      {line.split('').map((ch, i) => (
        <span key={i} style={{ color: color(i), fontWeight: color(i) === C.muted ? 400 : 700 }}>
          {ch}
        </span>
      ))}
    </div>
  );
}

export default function Day01(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={2}
      caption={
        props.part === 1
          ? 'Calibration value: the first (green) and last (gold) digit of each line.'
          : 'Spelled-out digits count too, and they may overlap (eightwo → 8 then 2).'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Line" value={frame.index + 1} />
            <Stat label="Value" value={frame.value} color={C.gold} />
            <Stat label="Sum" value={frame.sum} color={C.green} />
          </Stats>
          <Line frame={frame} />
        </div>
      )}
    />
  );
}
