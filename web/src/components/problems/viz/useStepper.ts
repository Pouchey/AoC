import { useCallback, useEffect, useRef, useState } from 'react';

/** Plays frames 0..count-1 with requestAnimationFrame; speed is in frames per second. */
export function useStepper(count: number, initialFps = 8) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [fps, setFps] = useState(initialFps);
  const last = useRef<number | null>(null);
  const carry = useRef(0);

  useEffect(() => {
    if (!playing || count <= 1) return;
    let raf = 0;
    const tick = (now: number) => {
      if (last.current !== null) {
        carry.current += ((now - last.current) / 1000) * fps;
        const advance = Math.floor(carry.current);
        if (advance > 0) {
          carry.current -= advance;
          setIndex((i) => {
            const next = Math.min(count - 1, i + advance);
            if (next === count - 1) setPlaying(false);
            return next;
          });
        }
      }
      last.current = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      last.current = null;
      carry.current = 0;
    };
  }, [playing, fps, count]);

  const clamp = useCallback((i: number) => Math.max(0, Math.min(count - 1, i)), [count]);

  return {
    index: clamp(index),
    playing,
    fps,
    setFps,
    toggle: () => {
      if (!playing && index >= count - 1) setIndex(0);
      setPlaying((p) => !p);
    },
    seek: (i: number) => {
      setPlaying(false);
      setIndex(clamp(i));
    },
    step: (delta: number) => {
      setPlaying(false);
      setIndex((i) => clamp(i + delta));
    }
  };
}
