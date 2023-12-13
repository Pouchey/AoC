/**
 * Enumerates the elements of an array along with their indices.
 *
 * @template T The type of the array elements.
 * @param arr The array to enumerate.
 * @returns An array of tuples, where each tuple contains an element from the original array and its corresponding index.
 *
 * @example
 * ```ts
 * enumerate(['a', 'b', 'c']); // [['a', 0], ['b', 1], ['c', 2]]
 * ```
 */
export const enumerate = <T = unknown>(arr: T[]): [T, number][] => {
  return arr.map((item, index) => [item, index]);
};
