import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function Lagoon({ frame }: { frame: Frame }) {
  const xs = frame.points.map((p) => p[0]);
  const ys = frame.points.map((p) => p[1]);
  const [minX, maxX, minY, maxY] = [
    Math.min(...xs),
    Math.max(...xs),
    Math.min(...ys),
    Math.max(...ys)
  ];
  const done = frame.area > 0;
  return (
    <Canvas
      aspect={Math.min(1.3, Math.max(0.4, (maxY - minY + 1) / (maxX - minX + 1)))}
      maxHeight={480}
      draw={(ctx, w, h) => {
        const s = Math.min((w - 20) / (maxX - minX || 1), (h - 20) / (maxY - minY || 1));
        const X = (v: number) => 10 + (v - minX) * s;
        const Y = (v: number) => 10 + (v - minY) * s;
        ctx.beginPath();
        frame.points
          .slice(0, frame.count + 1)
          .forEach(([x, y], i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, X(x), Y(y)));
        if (done) {
          ctx.closePath();
          ctx.fillStyle = '#58a6ff33';
          ctx.fill();
        }
        ctx.strokeStyle = C.gold;
        ctx.lineWidth = 2;
        ctx.stroke();
        const [lx, ly] = frame.points[frame.count];
        ctx.fillStyle = C.red;
        ctx.beginPath();
        ctx.arc(X(lx), Y(ly), 4, 0, Math.PI * 2);
        ctx.fill();
      }}
    />
  );
}

export default function Day18(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={props.part === 1 ? 8 : 8}
      caption={
        props.part === 1
          ? 'The digger draws the trench edge; the lagoon size is the shoelace area plus half the perimeter plus 1 (Pick).'
          : 'The real instructions are hidden in the hex colors: distances are huge, but the shoelace formula only needs the corners.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Move" value={frame.move} />
            <Stat label="Perimeter" value={frame.perimeter} />
            {frame.area > 0 && <Stat label="Cubic meters" value={frame.area} color={C.gold} />}
          </Stats>
          <Lagoon frame={frame} />
        </div>
      )}
    />
  );
}
