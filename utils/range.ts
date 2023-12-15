export type TRange = [number, number];

/**
 * Checks if a value is within a specified range.
 * @param value - The value to check.
 * @param range - The range to check against, specified as an array of [min, max].
 * @returns True if the value is within the range, false otherwise.
 */
export const isInRange = (value: number, [min, max]: TRange) => value >= min && value <= max;

/**
 * Calculates the intersection range between two ranges.
 * @param {TRange} rangeA - The first range.
 * @param {TRange} rangeB - The second range.
 * @returns {TRange | undefined} - The intersection range if it exists, otherwise undefined.
 */
export const intersectRange = ([startA, endA]: TRange, [startB, endB]: TRange) => {
  if (startA > endB || endA < startB) return;
  if (startA >= startB) {
    return endA < endB ? [startA, endA] : [startA, endB];
  }
  return endA < endB ? [startB, endA] : [startB, endB];
};

/**
 * Merges an array of ranges into a single merged range.
 * @param ranges - The array of ranges to be merged.
 * @returns The merged range.
 *
 * @example
 * ```ts
 *  mergeRanges([[1, 3], [2, 4], [5, 7], [6, 8]]); // [[1, 4], [5, 8]]
 * ```
 *
 */
export const mergeRanges = (ranges: TRange[]) => {
  ranges.sort(([min1], [min2]) => min1 - min2);
  const merged = [ranges[0]];
  for (const [min, max] of ranges.slice(1)) {
    const last = merged[merged.length - 1];
    if (min <= last[1] + 1) {
      last[1] = Math.max(max, last[1]);
    } else {
      merged.push([min, max]);
    }
  }
  return merged;
};
