import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function Race({ frame }: { frame: Frame }) {
  const { time, record, lo, hi } = frame;
  const peak = (time / 2) * (time / 2);
  return (
    <Canvas
      aspect={0.45}
      maxHeight={320}
      draw={(ctx, w, h) => {
        const x = (t: number) => 40 + (t / time) * (w - 60);
        const y = (d: number) => h - 24 - (d / peak) * (h - 44);
        ctx.fillStyle = '#3fb95022';
        ctx.fillRect(x(lo), 10, x(hi) - x(lo), h - 34);
        ctx.strokeStyle = C.red;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(x(0), y(record));
        ctx.lineTo(x(time), y(record));
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = C.blue;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const t = (time * i) / 200;
          (i ? ctx.lineTo : ctx.moveTo).call(ctx, x(t), y(t * (time - t)));
        }
        ctx.stroke();
        if (time <= 120)
          for (let t = 0; t <= time; t++) {
            ctx.fillStyle = t >= lo && t <= hi ? C.green : C.muted;
            ctx.beginPath();
            ctx.arc(x(t), y(t * (time - t)), 3, 0, Math.PI * 2);
            ctx.fill();
          }
        ctx.fillStyle = C.muted;
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText('hold time →', w - 110, h - 6);
        ctx.fillText('record', 44, y(record) - 6);
      }}
    />
  );
}

export default function Day06(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={1}
      caption={
        props.part === 1
          ? 'Holding the button h ms gives a distance h × (T − h): a parabola. Every hold time above the record line (green) wins.'
          : 'One single long race: no need to try every hold time, the winning range is between the two roots of the quadratic.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Time" value={frame.time} />
            <Stat label="Record" value={frame.record} color={C.red} />
            <Stat
              label="Winning holds"
              value={`${frame.lo}…${frame.hi} (${frame.ways})`}
              color={C.green}
            />
            <Stat label="Product" value={frame.product} color={C.gold} />
          </Stats>
          <Race frame={frame} />
        </div>
      )}
    />
  );
}
