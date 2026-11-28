import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

const WINDOW = 48;

function Sheet({ frame }: { frame: Frame }) {
  const input = frame.rows;
  const start = Math.max(0, frame.from - Math.floor((WINDOW - (frame.to - frame.from)) / 2));
  return (
    <pre className="font-mono text-sm leading-6 bg-bg-dark rounded-lg border border-grid-line p-3 overflow-x-auto">
      {input.map((row, r) => (
        <div key={r}>
          {row
            .slice(start, start + WINDOW)
            .split('')
            .map((ch, i) => {
              const c = start + i;
              const inside = c >= frame.from && c < frame.to;
              return (
                <span
                  key={i}
                  style={{
                    color: inside ? (r === input.length - 1 ? C.gold : C.text) : C.line,
                    background: inside ? '#58a6ff1a' : undefined
                  }}
                >
                  {ch}
                </span>
              );
            })}
        </div>
      ))}
    </pre>
  );
}

export default function Day06(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={2}
      caption={
        props.part === 1
          ? 'Each problem is a block of columns: the numbers are read row by row, the operator is on the last line.'
          : 'Cephalopod math: each column is one number read top to bottom, and the problem is read right to left.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat
              label="Problem"
              value={`${frame.numbers.join(` ${frame.op} `)} = ${frame.value}`}
            />
            <Stat label="Grand total" value={frame.total} color={C.gold} />
          </Stats>
          <Sheet frame={frame} />
        </div>
      )}
    />
  );
}
