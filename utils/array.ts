export const enumerate = <T = unknown>(arr: T[]): [T, number][] => {
  return arr.map((item, index) => [item, index]);
};
