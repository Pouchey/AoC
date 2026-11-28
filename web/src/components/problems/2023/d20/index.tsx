import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function Network({ frame }: { frame: Frame }) {
  const { modules } = frame;
  const index = new Map(modules.map((m, i) => [m.name, i]));
  return (
    <Canvas
      aspect={0.7}
      maxHeight={480}
      draw={(ctx, w, h) => {
        const n = modules.length;
        const r = Math.min(w, h) / 2 - 30;
        const xy = modules.map((_, i) => [
          w / 2 + Math.cos((i / n) * Math.PI * 2) * r,
          h / 2 + Math.sin((i / n) * Math.PI * 2) * r
        ]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#262f47';
        modules.forEach((m, i) =>
          m.outputs.forEach((o) => {
            const j = index.get(o)!;
            ctx.beginPath();
            ctx.moveTo(xy[i][0], xy[i][1]);
            ctx.lineTo(xy[j][0], xy[j][1]);
            ctx.stroke();
          })
        );
        const small = n > 20;
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        modules.forEach((m, i) => {
          ctx.fillStyle =
            m.kind === 'b'
              ? C.green
              : m.kind === '&'
                ? C.purple
                : m.kind === 'out'
                  ? C.red
                  : frame.on.has(m.name)
                    ? C.gold
                    : C.muted;
          ctx.beginPath();
          ctx.arc(xy[i][0], xy[i][1], small ? 5 : 12, 0, Math.PI * 2);
          ctx.fill();
          if (!small || m.kind !== '%') {
            ctx.fillStyle = C.text;
            ctx.fillText(m.name, xy[i][0], xy[i][1] - (small ? 9 : 17));
          }
        });
      }}
    />
  );
}

export default function Day20(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={6}
      caption={
        props.part === 1
          ? 'Press the button 1000 times; flip-flops (gold when on) toggle on low pulses, conjunctions (purple) send low only when they last heard high from all inputs. Answer: lows × highs.'
          : 'rx gets a low pulse when all inputs of its conjunction send high together: each input fires on its own cycle, so the answer is their LCM.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Press" value={frame.press} />
            <Stat label="Low" value={frame.low} color={C.blue} />
            <Stat label="High" value={frame.high} color={C.red} />
            {frame.cycles.map(([name, press]) => (
              <Stat key={name} label={name} value={press} color={C.gold} />
            ))}
          </Stats>
          <Network frame={frame} />
        </div>
      )}
    />
  );
}
