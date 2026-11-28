import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function Sky({ frame, part }: { frame: Frame; part: 1 | 2 }) {
  return (
    <Canvas
      aspect={1}
      maxHeight={500}
      draw={(ctx, w, h) => {
        let [lo, hi] = frame.area;
        if (part === 2) {
          const all = frame.stones
            .flatMap((s) => [s[0], s[1]])
            .concat(frame.rock ? [frame.rock[0], frame.rock[1]] : []);
          lo = Math.min(...all);
          hi = Math.max(...all);
        }
        const pad = (hi - lo) * 0.05;
        const X = (v: number) => ((v - lo + pad) / (hi - lo + 2 * pad)) * w;
        const Y = (v: number) => h - ((v - lo + pad) / (hi - lo + 2 * pad)) * h;
        if (part === 1) {
          ctx.strokeStyle = C.gold;
          ctx.strokeRect(X(lo), Y(hi), X(hi) - X(lo), Y(lo) - Y(hi));
        }
        ctx.lineWidth = 1;
        const big = (hi - lo) * 4;
        frame.stones.forEach((s, i) => {
          const speed = Math.hypot(s[3], s[4]) || 1;
          const hit = frame.hits?.includes(i);
          ctx.strokeStyle = hit ? C.red : '#8ab4ff55';
          ctx.beginPath();
          ctx.moveTo(X(s[0]), Y(s[1]));
          ctx.lineTo(X(s[0] + (s[3] / speed) * big), Y(s[1] + (s[4] / speed) * big));
          ctx.stroke();
          ctx.fillStyle = C.blue;
          ctx.fillRect(X(s[0]) - 1.5, Y(s[1]) - 1.5, 3, 3);
        });
        for (const [x, y, inside] of frame.crossings.slice(0, frame.shown)) {
          ctx.fillStyle = inside ? C.green : '#ff6b6b55';
          ctx.beginPath();
          ctx.arc(X(x), Y(y), inside ? 3 : 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        if (frame.rock) {
          const r = frame.rock;
          const last = Math.max(
            ...frame.hits!.map((i) => {
              const s = frame.stones[i];
              const k = [0, 1, 2].find((d) => s[3 + d] !== r[3 + d])!;
              return (r[k] - s[k]) / (s[3 + k] - r[3 + k]);
            })
          );
          ctx.strokeStyle = C.gold;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(X(r[0]), Y(r[1]));
          ctx.lineTo(X(r[0] + r[3] * last), Y(r[1] + r[4] * last));
          ctx.stroke();
        }
      }}
    />
  );
}

export default function Day24(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={props.part === 1 ? 8 : 6}
      caption={
        props.part === 1
          ? 'Hailstone paths in the X/Y plane: count the future crossings inside the test area (green).'
          : 'One rock thrown from the right place hits every hailstone (gold, X/Y projection). (P − Pᵢ) × (V − Vᵢ) = 0 gives a linear system, solved exactly with big integers.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Hailstones" value={frame.stones.length} />
            {props.part === 1 ? (
              <Stat label="Crossings in area" value={frame.count} color={C.green} />
            ) : (
              <>
                <Stat label="Hit" value={frame.count} color={C.red} />
                <Stat
                  label="Rock"
                  value={`${frame.rock!.slice(0, 3).join(', ')} @ ${frame.rock!.slice(3).join(', ')}`}
                  color={C.gold}
                />
              </>
            )}
          </Stats>
          <Sky frame={frame} part={props.part} />
        </div>
      )}
    />
  );
}
