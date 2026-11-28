import { Canvas } from '../../viz/Canvas';
import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { find, trace, type Frame } from './trace';

const PALETTE = [C.blue, C.green, C.gold, C.purple, C.red, '#39c5cf', '#ff7b72', '#7ee787'];

function Space({ frame, index }: { frame: Frame; index: number }) {
  const { points, edges, count } = frame;
  // Rebuild circuits for this frame to color them
  const parent = points.map((_, i) => i);
  for (let k = 0; k < count; k++) {
    const a = find(parent, edges[k][0]);
    const b = find(parent, edges[k][1]);
    if (a !== b) parent[a] = b;
  }
  const sizes = new Map<number, number>();
  points.forEach((_, i) => sizes.set(find(parent, i), (sizes.get(find(parent, i)) ?? 0) + 1));
  const rank = [...sizes].sort((a, b) => b[1] - a[1]).map(([root]) => root);
  const colorOf = (i: number) => {
    const root = find(parent, i);
    if (sizes.get(root) === 1) return C.muted;
    const r = rank.indexOf(root);
    return PALETTE[r % PALETTE.length];
  };
  const mins = [0, 1, 2].map((d) => Math.min(...points.map((p) => p[d])));
  const maxs = [0, 1, 2].map((d) => Math.max(...points.map((p) => p[d])));
  const norm = (p: number[]) => p.map((v, d) => (v - mins[d]) / (maxs[d] - mins[d] || 1) - 0.5);
  const angle = 0.6 + index * 0.01;

  return (
    <Canvas
      aspect={0.75}
      maxHeight={480}
      draw={(ctx, w, h) => {
        const project = (p: number[]) => {
          const [x, y, z] = norm(p);
          const rx = x * Math.cos(angle) - z * Math.sin(angle);
          const rz = x * Math.sin(angle) + z * Math.cos(angle);
          const s = Math.min(w, h) * 0.75;
          return [w / 2 + rx * s, h / 2 + (y * 0.8 + rz * 0.35) * s];
        };
        const xy = points.map(project);
        ctx.lineWidth = 1.5;
        for (let k = 0; k < count; k++) {
          const [i, j] = edges[k];
          ctx.strokeStyle = colorOf(i);
          ctx.globalAlpha = k === count - 1 ? 1 : 0.7;
          ctx.beginPath();
          ctx.moveTo(xy[i][0], xy[i][1]);
          ctx.lineTo(xy[j][0], xy[j][1]);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        const r = points.length > 100 ? 2 : 4;
        xy.forEach(([x, y], i) => {
          ctx.fillStyle = colorOf(i);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        });
      }}
    />
  );
}

export default function Day08(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={6}
      caption={
        props.part === 1
          ? 'Junction boxes are connected by increasing distance (10 pairs on the example, 1000 on the input). Answer: product of the 3 largest circuits.'
          : 'Keep connecting the closest pairs until everything is one circuit; the answer multiplies the X of the last two boxes joined.'
      }
      render={(frame, _t, index) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Connections" value={frame.count} />
            <Stat label="Circuits" value={frame.circuits} color={C.blue} />
            <Stat label="3 largest" value={frame.largest.join(' × ')} color={C.gold} />
          </Stats>
          <Space frame={frame} index={index} />
        </div>
      )}
    />
  );
}
