import type { TShape } from '@aoc/utils/shape';
import { GIFT_COLORS } from './utils';

interface GiftShapesProps {
  gifts: TShape[];
}

export function GiftShapes({ gifts }: GiftShapesProps) {
  return (
    <div>
      <h5 className="text-sm font-semibold text-text-primary mb-3">Gift Shapes</h5>
      <div className="grid grid-cols-3 gap-4">
        {gifts.map((gift: boolean[][], index: number) => (
          <div key={index} className="bg-bg-panel rounded-lg p-3 border border-grid-line">
            <div className="text-xs text-text-secondary mb-2">Shape {index}</div>
            <div className="flex flex-col gap-0.5">
              {gift.map((row: boolean[], rowIdx: number) => (
                <div key={rowIdx} className="flex gap-0.5">
                  {row.map((cell: boolean, colIdx: number) => (
                    <div
                      key={colIdx}
                      className={`w-3 h-3 rounded ${
                        cell ? GIFT_COLORS[index % GIFT_COLORS.length] : 'bg-bg-dark'
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

