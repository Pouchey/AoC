import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function Tape({ frame }: { frame: Frame }) {
  const n = frame.instructions.length;
  const at = frame.step % n;
  const from = Math.max(0, at - 20);
  return (
    <div className="font-mono text-lg bg-bg-dark rounded-lg border border-grid-line px-3 py-2 overflow-hidden whitespace-nowrap">
      {frame.instructions
        .slice(from, from + 50)
        .split('')
        .map((ch, i) => (
          <span
            key={i}
            style={{
              color: from + i === at ? C.gold : C.muted,
              fontWeight: from + i === at ? 700 : 400
            }}
          >
            {ch}
          </span>
        ))}
    </div>
  );
}

export default function Day08(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={props.part === 1 ? 10 : 1}
      caption={
        props.part === 1
          ? 'Follow the left/right instructions (repeated forever) from AAA until reaching ZZZ.'
          : 'Each ghost (start **A) reaches a **Z node on a fixed cycle; they all arrive together after the LCM of the cycles.'
      }
      render={(frame) =>
        props.part === 1 ? (
          <div className="space-y-3">
            <Stats>
              <Stat label="Step" value={frame.step} color={C.gold} />
              <Stat
                label="Node"
                value={frame.node}
                color={frame.node === 'ZZZ' ? C.green : C.blue}
              />
            </Stats>
            <Tape frame={frame} />
            <div className="flex flex-wrap items-center gap-1 font-mono text-sm">
              {frame.path.map((node, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span
                    className="px-2 py-1 rounded border"
                    style={{
                      borderColor: i === frame.path.length - 1 ? C.gold : C.line,
                      color: node === 'ZZZ' ? C.green : C.text
                    }}
                  >
                    {node}
                  </span>
                  {i < frame.path.length - 1 && <span className="text-text-secondary">→</span>}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Stats>
              <Stat label="Ghosts" value={frame.ghosts.length} />
              <Stat label="LCM" value={frame.lcm} color={C.gold} />
            </Stats>
            <div className="space-y-1.5">
              {frame.ghosts.map((g) => (
                <div key={g.start} className="flex items-center gap-2 font-mono text-sm">
                  <span className="w-12">{g.start}</span>
                  <div className="flex-1 h-5 bg-bg-dark rounded border border-grid-line">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${(g.cycle / Math.max(...frame.ghosts.map((x) => x.cycle))) * 100}%`,
                        background: C.blue
                      }}
                    />
                  </div>
                  <span className="w-20 text-right" style={{ color: C.gold }}>
                    {g.cycle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      }
    />
  );
}
