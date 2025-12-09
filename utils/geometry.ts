export type Point = [number, number]; // [col, row] or [x, y]

export type VerticalEdge = { col: number; min: number; max: number };
export type HorizontalEdge = { row: number; min: number; max: number };

export type Polygon = {
  vertical: VerticalEdge[];
  horizontal: HorizontalEdge[];
};

export interface Rectangle {
  minC: number;
  maxC: number;
  minR: number;
  maxR: number;
}

/**
 * Build polygon from a closed loop of points
 * @param points - The points that form the polygon
 * @returns The polygon edges
 * @example
 * ```ts
 * buildPolygon([[0, 0], [0, 1], [1, 1], [1, 0]]);
 * // { vertical: [{ col: 0, min: 0, max: 1 }], horizontal: [{ row: 0, min: 0, max: 1 }] }
 * ```
 */
export const buildPolygon = (points: Point[]): Polygon => {
  const vertical: VerticalEdge[] = [];
  const horizontal: HorizontalEdge[] = [];

  for (const [i, [col1, row1]] of points.entries()) {
    const [col2, row2] = points[(i + 1) % points.length];

    if (col1 === col2) {
      vertical.push({
        col: col1,
        min: Math.min(row1, row2),
        max: Math.max(row1, row2)
      });
    } else {
      horizontal.push({
        row: row1,
        min: Math.min(col1, col2),
        max: Math.max(col1, col2)
      });
    }
  }

  return { vertical, horizontal };
};

/**
 * Check if a point is inside or on the boundary of an axis-aligned polygon
 */
export const isPointInPolygon = (x: number, y: number, polygon: Polygon): boolean => {
  // Check if point is on boundary
  for (const edge of polygon.horizontal) {
    if (edge.row === x && y >= edge.min && y <= edge.max) {
      return true;
    }
  }
  for (const edge of polygon.vertical) {
    if (edge.col === y && x >= edge.min && x <= edge.max) {
      return true;
    }
  }

  // Ray casting: count vertical edge crossings to the left
  let crossings = 0;
  for (const edge of polygon.vertical) {
    if (edge.col < y && x > edge.min && y <= edge.max) {
      crossings++;
    }
  }

  return crossings % 2 === 1;
};

/**
 * Check if an axis-aligned rectangle is completely inside a polygon
 * (boundary sharing is allowed)
 */
export const isRectangleInPolygon = (rect: Rectangle, polygon: Polygon): boolean => {
  const { minC, maxC, minR, maxR } = rect;

  // Check if any edge cuts through rectangle interior
  for (const edge of polygon.vertical) {
    if (edge.col < minC || edge.col > maxC) continue;
    if (edge.max < minR || edge.min > maxR) continue;
    if (minC < edge.col && edge.col < maxC) {
      const overlapMin = Math.max(edge.min, minR);
      const overlapMax = Math.min(edge.max, maxR);
      if (overlapMin < overlapMax) return false;
    }
  }

  for (const edge of polygon.horizontal) {
    if (edge.row < minR || edge.row > maxR) continue;
    if (edge.max < minC || edge.min > maxC) continue;
    if (minR < edge.row && edge.row < maxR) {
      const overlapMin = Math.max(edge.min, minC);
      const overlapMax = Math.min(edge.max, maxC);
      if (overlapMin < overlapMax) return false;
    }
  }

  // Check all four corners
  const corners: Point[] = [
    [minC, minR],
    [maxC, minR],
    [minC, maxR],
    [maxC, maxR]
  ];

  return corners.every(([col, row]) => isPointInPolygon(col, row, polygon));
};
