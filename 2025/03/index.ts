const loadData = (input: string) => {
  // Each line is a bank of batteries
  return input.trim().split('\n');
};

const getMaxJoltage = (bank: string): number => {
  const digits = bank.split('').map(Number);
  let maxJoltage = 0;

  // Try all pairs of positions (i, j) where i < j
  for (let i = 0; i < digits.length; i++) {
    for (let j = i + 1; j < digits.length; j++) {
      const joltage = digits[i] * 10 + digits[j];
      maxJoltage = Math.max(maxJoltage, joltage);
    }
  }

  return maxJoltage;
};

const getMaxJoltage12 = (bank: string): number => {
  const digits = bank.split('').map(Number);
  const n = digits.length;
  const k = 12; // We need exactly 12 digits

  // Greedy algorithm: select exactly k digits to form the largest number
  // Similar to "Largest Number After Removing K Digits" but we keep k digits instead
  // We use a stack-like approach: maintain the largest possible sequence

  const result: number[] = [];

  for (let i = 0; i < n; i++) {
    // While we can improve by removing smaller digits from the end
    // and we still have enough digits remaining to form k digits total
    const remaining = n - i - 1; // digits after current position
    const needed = k - result.length; // digits we still need

    while (
      result.length > 0 &&
      result[result.length - 1] < digits[i] &&
      result.length + remaining >= k
    ) {
      result.pop();
    }

    // Add current digit if we haven't reached k yet
    if (result.length < k) {
      result.push(digits[i]);
    }
  }

  // Convert array of digits to a number
  // Since the number can be very large (12 digits), we need to use BigInt or string concatenation
  let joltageStr = '';
  for (const digit of result) {
    joltageStr += digit.toString();
  }

  // Return as number (JavaScript can handle up to Number.MAX_SAFE_INTEGER)
  return Number(joltageStr);
};

export const solve1 = (input: string) => {
  const banks = loadData(input);
  let totalJoltage = 0;

  for (const bank of banks) {
    totalJoltage += getMaxJoltage(bank);
  }

  return totalJoltage;
};

export const solve2 = (input: string) => {
  const banks = loadData(input);
  let totalJoltage = 0;

  for (const bank of banks) {
    totalJoltage += getMaxJoltage12(bank);
  }

  return totalJoltage;
};

export const exampleAnswer1 = 357;
export const exampleAnswer2 = 3121910778619;

export const firstPartCompleted = true;
