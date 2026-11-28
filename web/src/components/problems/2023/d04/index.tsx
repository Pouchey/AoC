import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, type Frame } from './trace';

function Copies({ frame }: { frame: Frame }) {
  const max = Math.max(...frame.copies);
  const { index } = frame;
  const won = frame.cards[index].matches;
  return (
    <div className="flex items-end gap-px h-40 bg-bg-dark rounded-lg border border-grid-line p-2">
      {frame.copies.map((n, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm min-w-px"
          title={`Card ${i + 1}: ${n}`}
          style={{
            height: `${Math.max(2, (Math.log(n + 1) / Math.log(max + 1)) * 100)}%`,
            background:
              i === index
                ? C.gold
                : i > index && i <= index + won
                  ? C.green
                  : i < index
                    ? C.blue
                    : C.line
          }}
        />
      ))}
    </div>
  );
}

export default function Day04(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={props.part === 1 ? 3 : 8}
      caption={
        props.part === 1
          ? 'Matching numbers (gold) are worth 1 point, doubled for each extra match.'
          : 'Each match wins a copy of the following cards (green), for every copy of the current card (gold). Bar height: copies (log scale).'
      }
      render={(frame) => {
        const card = frame.cards[frame.index];
        return (
          <div className="space-y-3">
            <Stats>
              <Stat label="Card" value={frame.index + 1} />
              <Stat label="Matches" value={card.matches} color={C.gold} />
              {props.part === 2 && (
                <Stat label="Copies" value={frame.copies[frame.index]} color={C.blue} />
              )}
              <Stat label="Total" value={frame.total} color={C.green} />
            </Stats>
            <div className="flex flex-wrap gap-1 font-mono text-sm">
              {card.winning.map((n) => (
                <span
                  key={`w${n}`}
                  className="px-1.5 py-0.5 rounded border"
                  style={{
                    borderColor: card.have.includes(n) ? C.gold : C.line,
                    color: card.have.includes(n) ? C.gold : C.muted
                  }}
                >
                  {n}
                </span>
              ))}
              <span className="px-2 text-text-secondary">|</span>
              {card.have.map((n, i) => (
                <span
                  key={`h${i}`}
                  className="px-1.5 py-0.5 rounded"
                  style={{
                    background: card.winning.includes(n) ? '#d2992233' : undefined,
                    color: card.winning.includes(n) ? C.gold : C.muted
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
            {props.part === 2 && <Copies frame={frame} />}
          </div>
        );
      }}
    />
  );
}
