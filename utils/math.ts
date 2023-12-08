const findGCD = (x: number, y: number) => {
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
};

export const findLCM = (a: number, b: number) => {
  return (a * b) / findGCD(a, b);
};

export const findLCMs = (numbers: number[]) => numbers.reduce(findLCM);
