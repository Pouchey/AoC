import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function MachineView({ frame, part }: { frame: Frame; part: 1 | 2 }) {
  const { machine, presses } = frame;
  const counters = machine.joltage.map((_, i) =>
    machine.buttons.reduce((s, btn, b) => s + (btn.includes(i) ? presses[b] : 0), 0)
  );
  const max = Math.max(1, ...machine.joltage);
  return (
    <div className="space-y-4">
      {part === 1 ? (
        <div className="flex gap-2">
          {machine.lights.map((on, i) => (
            <span
              key={i}
              className="w-8 h-8 rounded-full border-2"
              style={{
                borderColor: on ? C.gold : C.line,
                background: on ? C.gold : C.panel,
                boxShadow: on ? `0 0 12px ${C.gold}` : undefined
              }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {machine.joltage.map((target, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-mono">
              <span className="w-6 text-text-secondary">#{i}</span>
              <div className="flex-1 h-4 bg-bg-panel rounded border border-grid-line overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${(counters[i] / max) * 100}%`,
                    background: counters[i] === target ? C.green : C.red
                  }}
                />
              </div>
              <span className="w-16 text-right">
                {counters[i]}/{target}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {machine.buttons.map((btn, b) => (
          <span
            key={b}
            className="font-mono text-sm px-2 py-1 rounded-md border"
            style={{
              borderColor: presses[b] ? C.blue : C.line,
              color: presses[b] ? C.text : C.muted,
              background: presses[b] ? '#4fd8ff22' : C.panel
            }}
          >
            ({btn.join(',')}){presses[b] ? <b style={{ color: C.gold }}> ×{presses[b]}</b> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Day10(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={2}
      caption={
        props.part === 1
          ? 'Each button toggles some lights: find the fewest presses that light the pattern. Pressing twice cancels out, so each button is used at most once.'
          : 'Buttons now add 1 to counters: reach every target exactly with the fewest presses. Solved exactly by splitting presses into parity (0/1) + twice a smaller problem.'
      }
      render={(frame, t) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Machine" value={`${frame.index + 1}/${t.frames.length}`} />
            <Stat label="Presses" value={frame.total} color={C.blue} />
            <Stat label="Total" value={frame.sum} color={C.gold} />
          </Stats>
          <MachineView frame={frame} part={props.part} />
        </div>
      )}
    />
  );
}
