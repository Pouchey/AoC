import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function City({ frame }: { frame: Frame }) {
  const R = frame.heat.length;
  const W = frame.heat[0].length;
  return (
    <Canvas
      aspect={R / W}
      maxHeight={520}
      draw={(ctx, w, h) => {
        const cw = w / W;
        const ch = h / R;
        for (let r = 0; r < R; r++)
          for (let c = 0; c < W; c++) {
            const o = frame.order[r * W + c];
            const v = frame.heat[r][c];
            ctx.fillStyle =
              o >= 0 && o < frame.settled
                ? `hsl(210, 60%, ${15 + v * 4}%)`
                : `hsl(30, 15%, ${6 + v * 2.5}%)`;
            ctx.fillRect(c * cw, r * ch, cw, ch);
          }
        if (frame.showPath) {
          ctx.strokeStyle = C.gold;
          ctx.lineWidth = Math.max(2, cw / 3);
          ctx.beginPath();
          frame.path.forEach((cell, i) => {
            const x = (cell % W) * cw + cw / 2;
            const y = Math.floor(cell / W) * ch + ch / 2;
            (i ? ctx.lineTo : ctx.moveTo).call(ctx, x, y);
          });
          ctx.stroke();
        }
      }}
    />
  );
}

export default function Day17(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={20}
      caption={
        props.part === 1
          ? 'Dijkstra on (cell, axis): each move goes 1 to 3 blocks straight then must turn. Blue: explored, gold: least heat-loss path.'
          : 'Ultra crucibles: each straight run is 4 to 10 blocks long, which only changes the allowed moves.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Explored" value={frame.settled} color={C.blue} />
            {frame.showPath && <Stat label="Heat loss" value={frame.loss} color={C.gold} />}
          </Stats>
          <City frame={frame} />
        </div>
      )}
    />
  );
}
