export function assertEqual(actual: unknown, expected: unknown) {
  if (actual !== expected) {
    console.log('Example 1 failed!');
    console.log(`Expected ${expected}, got ${actual}\n`);
    return false;
  }
  console.log(`test successful, got ${JSON.stringify(expected)}\n`);

  return true;
}
