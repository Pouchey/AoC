import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

const angle = (n: number) => (n / 100) * Math.PI * 2 - Math.PI / 2;

function Dial({ frame }: { frame: Frame }) {
  return (
    <Canvas
      aspect={1}
      maxHeight={360}
      draw={(ctx, w, h) => {
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) / 2 - 28;
        ctx.lineWidth = 2;
        ctx.strokeStyle = C.line;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let n = 0; n < 100; n++) {
          const a = angle(n);
          const long = n % 10 === 0;
          ctx.strokeStyle = n === 0 ? C.gold : long ? C.muted : C.line;
          ctx.beginPath();
          ctx.moveTo(
            cx + Math.cos(a) * (r - (long ? 10 : 5)),
            cy + Math.sin(a) * (r - (long ? 10 : 5))
          );
          ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
          ctx.stroke();
          if (long) {
            ctx.fillStyle = n === 0 ? C.gold : C.muted;
            ctx.fillText(String(n), cx + Math.cos(a) * (r + 16), cy + Math.sin(a) * (r + 16));
          }
        }
        if (frame.move !== 'start') {
          const left = frame.move[0] === 'L';
          ctx.strokeStyle = left ? C.purple : C.blue;
          ctx.lineWidth = 6;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(cx, cy, r - 20, angle(frame.from), angle(frame.pos), left);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        const a = angle(frame.pos);
        ctx.strokeStyle = frame.hits ? C.green : C.text;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * (r - 14), cy + Math.sin(a) * (r - 14));
        ctx.stroke();
        ctx.fillStyle = C.text;
        ctx.font = 'bold 28px JetBrains Mono, monospace';
        ctx.fillText(String(frame.pos), cx, cy + 34);
      }}
    />
  );
}

export default function Day01(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      caption={
        props.part === 1
          ? 'The dial starts at 50; each rotation is drawn as an arc. Count the rotations that end on 0.'
          : 'Every click that passes through 0 counts, even in the middle of a long rotation.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Rotation" value={frame.move} />
            <Stat label="Position" value={frame.pos} />
            <Stat
              label="Zeros this move"
              value={frame.hits}
              color={frame.hits ? C.green : undefined}
            />
            <Stat label="Total" value={frame.count} color={C.gold} />
          </Stats>
          <Dial frame={frame} />
        </div>
      )}
    />
  );
}
