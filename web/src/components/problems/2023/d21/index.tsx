import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

const g = (frame: Frame, r: number, c: number) => frame.grid[r][c];

const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));

function Garden({ frame }: { frame: Frame }) {
  const n = frame.grid.length;
  const size = n * (2 * frame.tiles + 1);
  const rock = hex('#262f47');
  const plot = hex('#141a2b');
  const on = hex('#5fd39a');
  const seen = hex('#1f4b2c');
  return (
    <Canvas
      aspect={1}
      maxHeight={520}
      draw={(ctx, w, h) => {
        const image = ctx.createImageData(size, size);
        for (let k = 0; k < size * size; k++) {
          const r = Math.floor(k / size);
          const c = k % size;
          const d = frame.dist[k];
          const color =
            g(frame, r % n, c % n) === '#'
              ? rock
              : d >= 0 && d <= frame.step
                ? d % 2 === frame.step % 2
                  ? on
                  : seen
                : plot;
          image.data.set([...color, 255], k * 4);
        }
        const off = document.createElement('canvas');
        off.width = size;
        off.height = size;
        off.getContext('2d')!.putImageData(image, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(off, 0, 0, w, h);
        if (frame.tiles) {
          ctx.strokeStyle = '#f5c45166';
          for (let t = 1; t < 2 * frame.tiles + 1; t++) {
            const p = (t * n * w) / size;
            ctx.beginPath();
            ctx.moveTo(p, 0);
            ctx.lineTo(p, h);
            ctx.moveTo(0, p);
            ctx.lineTo(w, p);
            ctx.stroke();
          }
        }
      }}
    />
  );
}

export default function Day21(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={props.part === 1 ? 4 : 12}
      caption={
        props.part === 1
          ? 'The elf can end on a plot after exactly N steps if it is within N steps with the same parity (bright green): it can always step back and forth.'
          : 'On the infinite map, the count after 65 + 131k steps grows quadratically in k: measure k = 0, 1, 2 on a 5×5 tiling, then extrapolate to 26501365 steps.'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Steps" value={frame.step} />
            <Stat label="Reachable" value={frame.reachable} color={C.green} />
            {frame.samples.map((s, i) => (
              <Stat key={i} label={`f(${i})`} value={s} color={C.gold} />
            ))}
          </Stats>
          <Garden frame={frame} />
        </div>
      )}
    />
  );
}
