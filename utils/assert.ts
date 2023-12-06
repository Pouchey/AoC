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
