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
 * Check if a point (x = col, y = row, may be fractional) is inside or on the boundary
 * of an axis-aligned polygon
 */
export const isPointInPolygon = (x: number, y: number, polygon: Polygon): boolean => {
  // Check if point is on boundary
  for (const edge of polygon.horizontal) {
    if (edge.row === y && x >= edge.min && x <= edge.max) {
      return true;
    }
  }
  for (const edge of polygon.vertical) {
    if (edge.col === x && y >= edge.min && y <= edge.max) {
      return true;
    }
  }

  // Ray casting: count vertical edges crossed by a ray going left from the point
  // (half-open on rows so a ray passing through a vertex is counted once)
  let crossings = 0;
  for (const edge of polygon.vertical) {
    if (edge.col < x && y >= edge.min && y < edge.max) {
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

  // No edge may cut through the rectangle interior
  for (const edge of polygon.vertical) {
    if (minC < edge.col && edge.col < maxC && Math.max(edge.min, minR) < Math.min(edge.max, maxR)) {
      return false;
    }
  }
  for (const edge of polygon.horizontal) {
    if (minR < edge.row && edge.row < maxR && Math.max(edge.min, minC) < Math.min(edge.max, maxC)) {
      return false;
    }
  }

  // Without any edge inside it, the open interior lies entirely inside or entirely outside
  // the polygon, so its center decides (and then its boundary is inside too).
  if (minC < maxC && minR < maxR) {
    return isPointInPolygon((minC + maxC) / 2, (minR + maxR) / 2, polygon);
  }

  // Degenerate rectangle (a segment or a point): check every polygon coordinate along it
  // and the midpoints between them.
  const horizontalSegment = minR === maxR;
  const [from, to] = horizontalSegment ? [minC, maxC] : [minR, maxR];
  const crossing = horizontalSegment
    ? polygon.vertical.map((edge) => edge.col)
    : polygon.horizontal.map((edge) => edge.row);
  const stops = [...new Set([from, to, ...crossing.filter((v) => v > from && v < to)])].sort(
    (a, b) => a - b
  );
  const samples = stops.flatMap((v, i) => (i === 0 ? [v] : [(stops[i - 1] + v) / 2, v]));

  return samples.every((v) =>
    horizontalSegment ? isPointInPolygon(v, minR, polygon) : isPointInPolygon(minC, v, polygon)
  );
};
