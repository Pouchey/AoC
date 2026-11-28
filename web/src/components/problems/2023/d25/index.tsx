import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

/** Deterministic pseudo-random in [0, 1) */
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function Wires({ frame }: { frame: Frame }) {
  return (
    <Canvas
      aspect={0.6}
      maxHeight={460}
      draw={(ctx, w, h) => {
        const pos = frame.nodes.map((_, i) => {
          const a = rand(i, 1) * Math.PI * 2;
          const r = Math.sqrt(rand(i, 2));
          const mixed = [w / 2 + Math.cos(a) * r * h * 0.42, h / 2 + Math.sin(a) * r * h * 0.42];
          const cx = frame.side[i] ? w * 0.27 : w * 0.73;
          const split = [cx + Math.cos(a) * r * h * 0.36, h / 2 + Math.sin(a) * r * h * 0.4];
          return [
            mixed[0] + (split[0] - mixed[0]) * frame.t,
            mixed[1] + (split[1] - mixed[1]) * frame.t
          ];
        });
        const big = frame.nodes.length > 50;
        ctx.lineWidth = big ? 0.3 : 1;
        ctx.strokeStyle = '#8b949e55';
        for (const [a, b] of frame.edges) {
          ctx.beginPath();
          ctx.moveTo(pos[a][0], pos[a][1]);
          ctx.lineTo(pos[b][0], pos[b][1]);
          ctx.stroke();
        }
        if (frame.t > 0) {
          ctx.strokeStyle = C.red;
          ctx.lineWidth = 3;
          for (const [a, b] of frame.cut) {
            ctx.beginPath();
            ctx.moveTo(pos[a][0], pos[a][1]);
            ctx.lineTo(pos[b][0], pos[b][1]);
            ctx.stroke();
          }
        }
        frame.nodes.forEach((name, i) => {
          ctx.fillStyle = frame.t > 0 ? (frame.side[i] ? C.blue : C.green) : C.muted;
          ctx.beginPath();
          ctx.arc(pos[i][0], pos[i][1], big ? 1.6 : 5, 0, Math.PI * 2);
          ctx.fill();
          if (!big) {
            ctx.fillStyle = C.text;
            ctx.font = '10px JetBrains Mono, monospace';
            ctx.fillText(name, pos[i][0] + 6, pos[i][1] - 6);
          }
        });
      }}
    />
  );
}

export default function Day25(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={8}
      caption="Find the 3 wires (red) that split the machine in two: a max-flow from one component to every other stops at exactly 3 for nodes on the other side. Answer: product of the two group sizes."
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Components" value={frame.nodes.length} />
            <Stat label="Wires" value={frame.edges.length} />
            {frame.t > 0 && (
              <Stat label="Groups" value={`${frame.sizes[0]} × ${frame.sizes[1]}`} color={C.gold} />
            )}
          </Stats>
          <Wires frame={frame} />
        </div>
      )}
    />
  );
}
