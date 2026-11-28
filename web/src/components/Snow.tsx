/** A few slow snowflakes behind everything; hidden when reduced motion is requested. */
const FLAKES = Array.from({ length: 28 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 91.7 + n * 37.3) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    left: r(1) * 100,
    size: 1.5 + r(2) * 2.5,
    duration: 14 + r(3) * 16,
    delay: -r(4) * 30,
    drift: (r(5) - 0.5) * 60,
    opacity: 0.25 + r(6) * 0.4
  };
});

export function Snow() {
  return (
    <div
      className="snow pointer-events-none fixed inset-0 overflow-hidden -z-10"
      aria-hidden="true"
    >
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="snowflake absolute -top-2 rounded-full bg-white"
          style={
            {
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              '--drift': `${f.drift}px`
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
