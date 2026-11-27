import { useEffect, useRef, useState } from 'react';

interface CanvasProps {
  /** height / width ratio */
  aspect: number;
  maxHeight?: number;
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

/** Responsive, HiDPI canvas: `draw` gets CSS-pixel dimensions. */
export function Canvas({ aspect, maxHeight = 560, draw }: CanvasProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const height = Math.min(maxHeight, width * aspect);
  const drawWidth = aspect > 0 ? Math.min(width, height / aspect) : width;

  useEffect(() => {
    const el = canvas.current;
    if (!el || drawWidth <= 0 || height <= 0) return;
    const dpr = window.devicePixelRatio || 1;
    el.width = Math.round(drawWidth * dpr);
    el.height = Math.round(height * dpr);
    const ctx = el.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, drawWidth, height);
    draw(ctx, drawWidth, height);
  });

  return (
    <div ref={wrapper} className="w-full flex justify-center">
      <canvas
        ref={canvas}
        style={{ width: drawWidth, height }}
        className="rounded-lg bg-bg-dark border border-grid-line"
      />
    </div>
  );
}
