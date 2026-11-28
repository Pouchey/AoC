import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

const SPECIAL: Record<string, string> = {
  you: C.green,
  svr: C.green,
  out: C.gold,
  dac: C.purple,
  fft: C.purple
};

function GraphView({ frame }: { frame: Frame }) {
  const { graph, done } = frame;
  const tall = Math.max(...graph.pos.map((p) => p[1])) + 1;
  const small = graph.nodes.length > 60;
  return (
    <Canvas
      aspect={small ? 0.6 : 0.5}
      maxHeight={520}
      draw={(ctx, w, h) => {
        const counts = new Map<number, number>();
        graph.pos.forEach(([d]) => counts.set(d, (counts.get(d) ?? 0) + 1));
        const xy = graph.pos.map(([d, k]) => [
          30 + (d / Math.max(1, graph.depth)) * (w - 60),
          ((k + 1) / ((counts.get(d) ?? tall) + 1)) * h
        ]);
        ctx.lineWidth = small ? 0.5 : 1.5;
        for (const [a, b] of graph.edges) {
          ctx.strokeStyle = a < done ? '#4fd8ff88' : '#262f47';
          ctx.beginPath();
          ctx.moveTo(xy[a][0], xy[a][1]);
          ctx.lineTo(xy[b][0], xy[b][1]);
          ctx.stroke();
        }
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        graph.nodes.forEach((name, i) => {
          const special = SPECIAL[name];
          const r = special ? (small ? 5 : 9) : small ? 2 : 8;
          ctx.fillStyle = special ?? (i < done ? C.blue : C.muted);
          if (i === frame.current) ctx.fillStyle = C.text;
          ctx.beginPath();
          ctx.arc(xy[i][0], xy[i][1], r, 0, Math.PI * 2);
          ctx.fill();
          if (!small || special) {
            ctx.fillStyle = C.text;
            ctx.fillText(name, xy[i][0], xy[i][1] - r - 4);
            if (!small && i < done && frame.ways[i]) {
              ctx.fillStyle = C.gold;
              ctx.fillText(String(frame.ways[i]), xy[i][0], xy[i][1] + r + 12);
            }
          }
        });
      }}
    />
  );
}

export default function Day11(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={props.part === 1 ? 3 : 20}
      caption={
        props.part === 1
          ? 'Count the paths from you to out: nodes are processed in topological order and each one passes its path count (gold) to its outputs.'
          : 'From svr to out, only paths through both dac and fft count: each node keeps 4 counters (seen neither, dac, fft, both); the gold number is "both".'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Node" value={frame.graph.nodes[frame.current]} />
            <Stat label="Processed" value={`${frame.done}/${frame.graph.nodes.length}`} />
            <Stat
              label="Paths to out"
              value={frame.ways[frame.graph.nodes.indexOf('out')] ?? 0}
              color={C.gold}
            />
          </Stats>
          <GraphView frame={frame} />
        </div>
      )}
    />
  );
}
