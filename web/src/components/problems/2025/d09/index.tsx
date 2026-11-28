import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame, type Rect } from './trace';

function Floor({ frame, part }: { frame: Frame; part: 1 | 2 }) {
  const xs = frame.tiles.map((t) => t[0]);
  const ys = frame.tiles.map((t) => t[1]);
  const [minX, maxX, minY, maxY] = [
    Math.min(...xs),
    Math.max(...xs),
    Math.min(...ys),
    Math.max(...ys)
  ];
  const spanX = maxX - minX + 1;
  const spanY = maxY - minY + 1;
  return (
    <Canvas
      aspect={Math.min(1.2, Math.max(0.4, spanY / spanX))}
      maxHeight={520}
      draw={(ctx, w, h) => {
        const s = Math.min((w - 20) / spanX, (h - 20) / spanY);
        const X = (x: number) => 10 + (x - minX) * s;
        const Y = (y: number) => 10 + (y - minY) * s;
        const rect = ([a, b, c, d]: Rect, fill: string, stroke: string) => {
          ctx.fillStyle = fill;
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 2;
          ctx.fillRect(X(a), Y(b), (c - a + 1) * s, (d - b + 1) * s);
          ctx.strokeRect(X(a), Y(b), (c - a + 1) * s, (d - b + 1) * s);
        };
        if (part === 2) {
          ctx.fillStyle = '#5fd39a26';
          ctx.strokeStyle = C.green;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          frame.tiles.forEach(([x, y], i) =>
            (i ? ctx.lineTo : ctx.moveTo).call(ctx, X(x) + s / 2, Y(y) + s / 2)
          );
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        if (frame.candidate && frame.candidate !== frame.best)
          rect(frame.candidate, '#ff6b6b22', frame.ok === false && part === 2 ? C.red : C.muted);
        if (frame.best) rect(frame.best, '#f5c45144', C.gold);
        const r = Math.max(1.5, Math.min(5, s / 2));
        ctx.fillStyle = C.red;
        for (const [x, y] of frame.tiles) {
          ctx.beginPath();
          ctx.arc(X(x) + s / 2, Y(y) + s / 2, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }}
    />
  );
}

export default function Day09(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={8}
      caption={
        props.part === 1
          ? 'Any two red tiles can be opposite corners of a rectangle: find the largest (gold).'
          : 'The rectangle must now stay inside the loop of red and green tiles: candidates are tried from the largest down (red = rejected).'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Rectangles checked" value={frame.checked} />
            <Stat label="Best area" value={frame.bestArea} color={C.gold} />
          </Stats>
          <Floor frame={frame} part={props.part} />
        </div>
      )}
    />
  );
}
