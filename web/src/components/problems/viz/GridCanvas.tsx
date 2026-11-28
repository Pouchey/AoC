import { Canvas } from './Canvas';

interface GridCanvasProps {
  rows: number;
  cols: number;
  /** Color of a cell, or null to leave the background */
  color: (r: number, c: number) => string | null;
  /** Optional text drawn in cells when they are big enough */
  label?: (r: number, c: number) => string | null;
  maxHeight?: number;
}

export function GridCanvas({ rows, cols, color, label, maxHeight }: GridCanvasProps) {
  return (
    <Canvas
      aspect={rows / cols}
      maxHeight={maxHeight}
      draw={(ctx, width, height) => {
        const cw = width / cols;
        const ch = height / rows;
        const gap = cw > 6 ? 1 : 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const fill = color(r, c);
            if (!fill) continue;
            ctx.fillStyle = fill;
            ctx.fillRect(c * cw, r * ch, cw - gap, ch - gap);
          }
        }
        if (label && cw >= 12) {
          ctx.font = `${Math.floor(Math.min(cw, ch) * 0.6)}px JetBrains Mono, monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#e6edf3';
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const text = label(r, c);
              if (text) ctx.fillText(text, c * cw + cw / 2, r * ch + ch / 2 + 1);
            }
          }
        }
      }}
    />
  );
}
