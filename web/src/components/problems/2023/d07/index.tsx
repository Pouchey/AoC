import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { trace, TYPES } from './trace';

const TYPE_COLORS = [C.muted, C.blue, '#39c5cf', C.green, C.gold, C.purple, C.red];

export default function Day07(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={4}
      caption={
        props.part === 1
          ? 'Hands are ranked by type, then card by card. Each hand wins bid × rank.'
          : 'J is now a joker: it joins the largest group to make the best type, but is the weakest card in ties.'
      }
      render={(frame) => {
        const from = Math.max(0, frame.rank - 10);
        const shown = frame.ranked.slice(from, frame.rank).reverse();
        return (
          <div className="space-y-3">
            <Stats>
              <Stat label="Rank" value={`${frame.rank}/${frame.ranked.length}`} />
              <Stat label="Winnings" value={frame.total} color={C.gold} />
            </Stats>
            <div className="space-y-1">
              {shown.map((hand, i) => {
                const rank = frame.rank - i;
                return (
                  <div
                    key={rank}
                    className="flex items-center gap-3 font-mono text-sm"
                    style={{ opacity: i === 0 ? 1 : 0.65 }}
                  >
                    <span className="w-12 text-right text-text-secondary">#{rank}</span>
                    <span className="flex gap-1">
                      {hand.cards.split('').map((card, k) => (
                        <span
                          key={k}
                          className="w-7 h-9 flex items-center justify-center rounded border font-bold"
                          style={{
                            borderColor: C.line,
                            background: C.panel,
                            color: props.part === 2 && card === 'J' ? C.purple : C.text
                          }}
                        >
                          {card}
                        </span>
                      ))}
                    </span>
                    <span className="w-32 text-xs" style={{ color: TYPE_COLORS[hand.type] }}>
                      {TYPES[hand.type]}
                    </span>
                    <span className="text-text-secondary">
                      {hand.bid} × {rank} = <span style={{ color: C.gold }}>{hand.bid * rank}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
