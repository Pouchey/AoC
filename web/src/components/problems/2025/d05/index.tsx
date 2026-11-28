import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function NumberLine({ frame }: { frame: Frame }) {
  const all = [...frame.ranges.flat(), ...frame.checked.map((c) => c.id)];
  const min = Math.min(...all);
  const max = Math.max(...all);
  return (
    <Canvas
      aspect={0.42}
      maxHeight={300}
      draw={(ctx, w, h) => {
        const x = (v: number) => 20 + ((v - min) / (max - min || 1)) * (w - 40);
        // individual ranges, stacked
        const lane = (h * 0.45) / Math.max(1, frame.ranges.length);
        frame.ranges.forEach(([lo, hi], i) => {
          ctx.fillStyle = '#8ab4ff55';
          ctx.fillRect(x(lo), 10 + i * lane, Math.max(2, x(hi) - x(lo)), Math.max(1, lane - 1));
        });
        // merged ranges
        const y = h * 0.62;
        ctx.fillStyle = C.line;
        ctx.fillRect(20, y + 8, w - 40, 2);
        for (const [lo, hi] of frame.merged) {
          ctx.fillStyle = C.green;
          ctx.fillRect(x(lo), y, Math.max(3, x(hi) - x(lo)), 18);
        }
        // checked IDs
        for (const { id, fresh } of frame.checked) {
          ctx.fillStyle = fresh ? C.gold : C.red;
          ctx.fillRect(x(id) - 1, y + 26, 2, 14);
        }
        if (frame.id !== undefined) {
          ctx.fillStyle = C.text;
          ctx.beginPath();
          ctx.moveTo(x(frame.id), y + 44);
          ctx.lineTo(x(frame.id) - 6, y + 56);
          ctx.lineTo(x(frame.id) + 6, y + 56);
          ctx.fill();
        }
        ctx.fillStyle = C.muted;
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(String(min), 20, h - 6);
        ctx.textAlign = 'right';
        ctx.fillText(String(max), w - 20, h - 6);
      }}
    />
  );
}

export default function Day05(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={props.part === 1 ? 10 : 4}
      caption={
        props.part === 1
          ? 'Blue: fresh ID ranges, green: the same ranges merged. Each available ingredient ID is checked against them (gold fresh, red spoiled).'
          : 'Ranges sorted by start are merged one by one; the answer is the total length of the merged ranges.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Step" value={frame.label} />
            {frame.fresh !== undefined && (
              <Stat
                label="Status"
                value={frame.fresh ? 'fresh' : 'spoiled'}
                color={frame.fresh ? C.gold : C.red}
              />
            )}
            <Stat
              label={props.part === 1 ? 'Fresh IDs' : 'IDs covered'}
              value={frame.count}
              color={C.green}
            />
          </Stats>
          <NumberLine frame={frame} />
        </div>
      )}
    />
  );
}
