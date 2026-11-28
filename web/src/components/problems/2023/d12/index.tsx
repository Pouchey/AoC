import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace } from './trace';

const COLOR: Record<string, string> = { '#': C.red, '.': C.line, '?': C.gold };

function Springs({ text, known }: { text: string; known?: string }) {
  return (
    <div className="flex flex-wrap gap-px font-mono">
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="w-5 h-6 flex items-center justify-center text-xs rounded-sm"
          style={{
            background: ch === '#' ? (known?.[i] === '?' ? '#d29922aa' : C.red) : C.panel,
            color: ch === '#' ? C.bg : (COLOR[ch] ?? C.text)
          }}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}

export default function Day12(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={1}
      caption={
        props.part === 1
          ? 'Damaged springs (#) must form the listed contiguous groups; each unknown (?) is either. Count the valid arrangements (examples below).'
          : 'Rows are unfolded ×5: far too many arrangements to list, so they are counted with memoization on (position, group).'
      }
      render={(frame) => (
        <div className="space-y-3">
          <Stats>
            <Stat label="Row" value={frame.index + 1} />
            <Stat label="Groups" value={frame.groups.join(',')} />
            <Stat label="Arrangements" value={frame.count} color={C.gold} />
            <Stat label="Sum" value={frame.sum} color={C.green} />
          </Stats>
          <Springs text={frame.pattern} />
          <div className="space-y-1 pl-4 border-l-2 border-grid-line">
            {frame.examples.map((e, i) => (
              <Springs key={i} text={e} known={frame.pattern} />
            ))}
            {frame.count > frame.examples.length && (
              <p className="text-xs text-text-secondary">
                … and {frame.count - frame.examples.length} more
              </p>
            )}
          </div>
        </div>
      )}
    />
  );
}
