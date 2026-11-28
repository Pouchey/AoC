import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function Universe({ frame }: { frame: Frame }) {
  const { rows, cols, galaxies, emptyRows, emptyCols, t } = frame;
  // Drawn with a visual factor of 2 whatever the real factor
  const pos = (v: number, empties: number[]) => v + empties.filter((e) => e < v).length * t;
  const R = rows + emptyRows.length;
  const Cn = cols + emptyCols.length;
  return (
    <Canvas
      aspect={R / Cn}
      maxHeight={520}
      draw={(ctx, w, h) => {
        const cw = w / Cn;
        const ch = h / R;
        ctx.fillStyle = '#a371f722';
        for (const e of emptyRows) ctx.fillRect(0, pos(e, emptyRows) * ch, w, ch * (1 + t));
        for (const e of emptyCols) ctx.fillRect(pos(e, emptyCols) * cw, 0, cw * (1 + t), h);
        const r = Math.max(1.2, Math.min(cw, ch) * 0.4);
        ctx.fillStyle = C.gold;
        for (const [gr, gc] of galaxies) {
          ctx.beginPath();
          ctx.arc(
            (pos(gc, emptyCols) + 0.5) * cw,
            (pos(gr, emptyRows) + 0.5) * ch,
            r,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }}
    />
  );
}

export default function Day11(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={8}
      caption={
        props.part === 1
          ? 'Rows and columns without galaxies (purple) are twice as big; then sum the Manhattan distance of every pair.'
          : 'Empty rows and columns are now a million times bigger (drawn ×2 here): only the count of empty lines between galaxies matters.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Galaxies" value={frame.galaxies.length} />
            <Stat label="Pairs" value={(frame.galaxies.length * (frame.galaxies.length - 1)) / 2} />
            <Stat label="Expansion" value={`×${frame.factor}`} color={C.purple} />
            {frame.sum > 0 && <Stat label="Sum of distances" value={frame.sum} color={C.gold} />}
          </Stats>
          <Universe frame={frame} />
        </div>
      )}
    />
  );
}
