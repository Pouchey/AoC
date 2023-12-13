import { TGrid } from './grid';

/**
 * Parses the input string into a grid of values.
 *
 * @template T - The type of values in the grid.
 * @param input - The input string to parse.
 * @param splitRegex - The regular expression used to split each line of the input string. Defaults to \/\s*\/
 * @param transform - The function used to transform each character of the input string. Defaults to the identity function.
 * @returns A grid of values.
 *
 * @example
 * ```ts
 * parseLines('12 34\n56 78',/\s+\/, (char) => +char); // [[12, 34], [56, 78]]
 * ```
 *
 */

export const parseLines = <T = string>(
  input: string,
  splitRegex: RegExp = /\s*/,
  transform = (char: string) => char as T
): TGrid<T> => input.split('\n').map((line) => line.split(splitRegex).map(transform));

/**
 * Parses the input string into an array of blocks.
 * A block is defined as a group of consecutive lines separated by an empty line.
 *
 * @param input - The input string to parse.
 * @returns An array of blocks.
 */
export const parseBlocks = (input: string): string[] => input.split('\n\n');
