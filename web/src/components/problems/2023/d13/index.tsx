import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function Pattern({ frame }: { frame: Frame }) {
  const R = frame.pattern.length;
  const W = frame.pattern[0].length;
  return (
    <Canvas
      aspect={R / W}
      maxHeight={360}
      draw={(ctx, w, h) => {
        const cw = w / W;
        const ch = h / R;
        const span =
          frame.axis === 'row'
            ? Math.min(frame.at, R - frame.at)
            : Math.min(frame.at, W - frame.at);
        for (let r = 0; r < R; r++)
          for (let c = 0; c < W; c++) {
            const i = frame.axis === 'row' ? r : c;
            const reflected = i >= frame.at - span && i < frame.at + span;
            const rock = frame.pattern[r][c] === '#';
            ctx.fillStyle = rock
              ? reflected
                ? C.blue
                : C.muted
              : reflected
                ? '#4fd8ff1a'
                : C.cell;
            if (frame.smudge && frame.smudge[0] === r && frame.smudge[1] === c)
              ctx.fillStyle = C.red;
            ctx.fillRect(c * cw, r * ch, cw - 1, ch - 1);
          }
        ctx.strokeStyle = C.gold;
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (frame.axis === 'row') {
          ctx.moveTo(0, frame.at * ch - 0.5);
          ctx.lineTo(w, frame.at * ch - 0.5);
        } else {
          ctx.moveTo(frame.at * cw - 0.5, 0);
          ctx.lineTo(frame.at * cw - 0.5, h);
        }
        ctx.stroke();
      }}
    />
  );
}

export default function Day13(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={1}
      caption={
        props.part === 1
          ? 'Find the line (gold) where the pattern mirrors itself; rows above count ×100, columns to the left ×1.'
          : 'Each pattern has exactly one smudge (red): the new mirror line is the one with exactly one difference.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Pattern" value={frame.index + 1} />
            <Stat
              label="Mirror"
              value={`${frame.axis === 'row' ? 'horizontal' : 'vertical'} @ ${frame.at}`}
              color={C.gold}
            />
            <Stat label="Score" value={frame.score} />
            <Stat label="Total" value={frame.total} color={C.green} />
          </Stats>
          <Pattern frame={frame} />
        </div>
      )}
    />
  );
}
