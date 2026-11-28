import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

/**
 * Two side views (x–z and y–z) of the stack. Tall stacks are cut into segments of z drawn side by
 * side, bottom segment on the left.
 */
function Stack({ frame }: { frame: Frame }) {
  const shown = frame.bricks.map((b, i) => (i < frame.done ? frame.settled[i] : b));
  const maxX = Math.max(...shown.map((b) => b[3])) + 1;
  const maxY = Math.max(...shown.map((b) => b[4])) + 1;
  const maxZ = Math.max(...shown.map((b) => b[5])) + 1;
  const unit = maxX + maxY + 3;
  const segments = Math.max(1, Math.round(Math.sqrt(maxZ / (0.75 * unit))));
  const segLen = Math.ceil(maxZ / segments);
  return (
    <Canvas
      aspect={Math.min(1.2, Math.max(0.4, segLen / (segments * unit)))}
      maxHeight={560}
      draw={(ctx, w, h) => {
        const cell = Math.min(w / (segments * unit), h / segLen);
        for (let seg = 0; seg < segments; seg++) {
          const z0 = seg * segLen;
          const left = seg * unit * cell;
          ctx.save();
          ctx.beginPath();
          ctx.rect(left, 0, unit * cell, h);
          ctx.clip();
          ctx.fillStyle = C.line;
          ctx.fillRect(left + (unit - 0.5) * cell, 0, 1, h);
          const views: [number, number, number][] = [
            [0, 3, left],
            [1, 4, left + (maxX + 1) * cell]
          ];
          for (const [lo, hi, ox] of views)
            shown.forEach((b, i) => {
              if (b[5] < z0 || b[2] >= z0 + segLen) return;
              ctx.fillStyle =
                frame.removed === i
                  ? C.red
                  : frame.falling.has(i)
                    ? C.gold
                    : frame.safe.has(i)
                      ? C.green
                      : `hsl(${(i * 47) % 360}, 45%, 50%)`;
              ctx.globalAlpha =
                frame.removed !== undefined && frame.removed !== i && !frame.falling.has(i)
                  ? 0.25
                  : 0.85;
              const top = h - (b[5] - z0 + 1) * cell;
              ctx.fillRect(
                ox + b[lo] * cell,
                top,
                (b[hi] - b[lo] + 1) * cell - 0.5,
                (b[5] - b[2] + 1) * cell - 0.5
              );
            });
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      }}
    />
  );
}

export default function Day22(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={props.part === 1 ? 10 : 3}
      caption={
        props.part === 1
          ? 'Bricks fall until they land (side views x–z and y–z). A brick is safe to disintegrate (green) if everything it holds has another support.'
          : 'Remove one brick (red) and count the bricks that fall in a chain reaction (gold).'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Bricks" value={frame.bricks.length} />
            {props.part === 1 ? (
              <Stat label="Settled" value={frame.done} />
            ) : (
              <Stat label="Falling" value={frame.falling.size} color={C.gold} />
            )}
            {frame.total > 0 && (
              <Stat
                label={props.part === 1 ? 'Safe' : 'Total falls'}
                value={frame.total}
                color={C.green}
              />
            )}
          </Stats>
          <Stack frame={frame} />
        </div>
      )}
    />
  );
}
