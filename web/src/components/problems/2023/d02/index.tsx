import { C } from '../../viz/colors';
import { DayViz, Stat, Stats } from '../../viz/DayViz';
import type { VizProps } from '../../viz/types';
import { LIMIT, trace, type RGB } from './trace';

const COLORS: Record<keyof RGB, string> = { red: C.red, green: C.green, blue: C.blue };

export default function Day02(props: VizProps) {
  return (
    <DayViz
      {...props}
      trace={trace}
      fps={2}
      caption={
        props.part === 1
          ? 'A game is possible if no draw shows more than 12 red, 13 green and 14 blue cubes (dashed lines).'
          : 'The fewest cubes needed are the maximum of each color over the draws; the power is their product.'
      }
      render={(frame) => {
        const scale = Math.max(20, frame.max.red, frame.max.green, frame.max.blue);
        return (
          <div className="space-y-3">
            <Stats>
              <Stat label="Game" value={frame.id} />
              {props.part === 1 ? (
                <Stat
                  label="Possible"
                  value={frame.possible ? 'yes' : 'no'}
                  color={frame.possible ? C.green : C.red}
                />
              ) : (
                <Stat label="Power" value={frame.power} color={C.purple} />
              )}
              <Stat label="Total" value={frame.total} color={C.gold} />
            </Stats>
            <div className="space-y-2">
              {(Object.keys(COLORS) as (keyof RGB)[]).map((color) => (
                <div key={color} className="flex items-center gap-2">
                  <span className="w-12 text-sm text-text-secondary">{color}</span>
                  <div className="relative flex-1 h-7 bg-bg-dark rounded border border-grid-line">
                    {frame.draws.map((d, i) => (
                      <div
                        key={i}
                        className="absolute top-1 bottom-1 rounded-sm"
                        style={{
                          left: 0,
                          width: `${(d[color] / scale) * 100}%`,
                          background: COLORS[color],
                          opacity: 0.25
                        }}
                      />
                    ))}
                    <div
                      className="absolute top-1 bottom-1 rounded-sm border-2"
                      style={{
                        width: `${(frame.max[color] / scale) * 100}%`,
                        borderColor: COLORS[color]
                      }}
                    />
                    {props.part === 1 && (
                      <div
                        className="absolute -top-1 -bottom-1 border-l-2 border-dashed"
                        style={{ left: `${(LIMIT[color] / scale) * 100}%`, borderColor: C.text }}
                      />
                    )}
                  </div>
                  <span className="w-8 text-right font-mono" style={{ color: COLORS[color] }}>
                    {frame.max[color]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
