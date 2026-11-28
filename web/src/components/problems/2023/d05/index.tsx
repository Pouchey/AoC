import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function Stages({ frame }: { frame: Frame }) {
  const all = frame.stages.flat();
  const min = Math.min(...all.map((r) => r[0]));
  const max = Math.max(...all.map((r) => r[1]));
  return (
    <Canvas
      aspect={0.55}
      maxHeight={440}
      draw={(ctx, w, h) => {
        const left = 90;
        const rowH = h / frame.names.length;
        const x = (v: number) => left + ((v - min) / (max - min || 1)) * (w - left - 16);
        ctx.font = '12px JetBrains Mono, monospace';
        ctx.textBaseline = 'middle';
        frame.names.forEach((name, s) => {
          const y = s * rowH + rowH / 2;
          ctx.fillStyle = s <= frame.stage ? C.text : C.line;
          ctx.fillText(name, 8, y);
          ctx.fillStyle = C.line;
          ctx.fillRect(left, y, w - left - 16, 1);
          if (s > frame.stage) return;
          for (const [lo, hi] of frame.stages[s]) {
            ctx.fillStyle = s === frame.stage ? C.gold : C.blue;
            ctx.fillRect(x(lo), y - rowH * 0.25, Math.max(2, x(hi) - x(lo)), rowH * 0.5);
          }
        });
        if (frame.stage === frame.names.length - 1) {
          const lowest = Math.min(...frame.stages[frame.stage].map((r) => r[0]));
          ctx.strokeStyle = C.green;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x(lowest), 0);
          ctx.lineTo(x(lowest), h);
          ctx.stroke();
        }
      }}
    />
  );
}

export default function Day05(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={1}
      caption={
        props.part === 1
          ? 'Each seed goes through the 7 maps (seed → soil → … → location); the answer is the lowest location (green line).'
          : 'Seeds are now ranges: instead of mapping billions of seeds, whole intervals are split and shifted at each stage.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Stage" value={frame.names[frame.stage]} />
            <Stat
              label={props.part === 1 ? 'Values' : 'Ranges'}
              value={frame.stages[frame.stage].length}
              color={C.blue}
            />
            <Stat
              label="Lowest"
              value={Math.min(...frame.stages[frame.stage].map((r) => r[0]))}
              color={C.gold}
            />
          </Stats>
          <Stages frame={frame} />
        </div>
      )}
    />
  );
}
