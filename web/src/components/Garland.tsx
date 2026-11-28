/**
 * A string of fairy lights with one bulb per star of the year: earned stars are lit and twinkle,
 * the others stay as dim glass. It replaces a plain progress bar.
 */
const COLORS = ['#ff4d6d', '#ffd166', '#3df5a7', '#4fd8ff', '#ff5cc8'];
const SWOOPS = 4;
const DEPTH = 14;

/** Vertical sag of the wire at x in [0, 1] */
const sag = (x: number) => Math.sin(Math.PI * ((x * SWOOPS) % 1)) * DEPTH;

export function Garland({ total, lit }: { total: number; lit: number }) {
  const wire = Array.from({ length: 201 }, (_, i) => {
    const x = i / 200;
    return `${i ? 'L' : 'M'}${x * 1000},${4 + sag(x)}`;
  }).join(' ');

  return (
    <div className="relative h-12" role="img" aria-label={`${lit} of ${total} stars earned`}>
      <svg
        viewBox="0 0 1000 24"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 w-full h-6"
        aria-hidden="true"
      >
        <path
          d={wire}
          fill="none"
          stroke="#2c3550"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {Array.from({ length: total }, (_, i) => {
        const x = (i + 0.5) / total;
        const on = i < lit;
        const color = COLORS[i % COLORS.length];
        const tilt = Math.cos(Math.PI * ((x * SWOOPS) % 1)) * -18;
        return (
          <span
            key={i}
            className="absolute flex flex-col items-center"
            style={{
              left: `${x * 100}%`,
              top: `${(4 + sag(x)) * 1}px`,
              transform: `translateX(-50%) rotate(${tilt}deg)`
            }}
            aria-hidden="true"
          >
            <span className="block w-1.5 h-1 rounded-t-sm bg-[#3a4462]" />
            <span
              className={`block w-2 h-3 rounded-full ${on ? 'bulb-on' : ''}`}
              style={
                on
                  ? {
                      background: color,
                      boxShadow: `0 0 6px ${color}, 0 0 16px ${color}99`,
                      animationDelay: `${(i * 0.37) % 2.4}s`
                    }
                  : { background: '#232b42' }
              }
            />
          </span>
        );
      })}
    </div>
  );
}
