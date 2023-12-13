/**
 * Asserts that the actual value is equal to the expected value.
 * If the values are not equal, an error message is logged and false is returned.
 * If the values are equal, a success message is logged and true is returned.
 *
 * @param actual - The actual value to compare.
 * @param expected - The expected value to compare against.
 * @returns True if the values are equal, false otherwise.
 */
import { log } from './logger';

export function assertEqual(actual: unknown, expected: unknown) {
  if (actual !== expected) {
    log('Example 1 failed!', 'error', 'red');
    log(`Expected ${expected}, got ${actual}\n`, 'log', 'red');
    return false;
  }
  log(`test successful, got ${JSON.stringify(expected)}\n`, 'log', 'christmas');

  return true;
}
