type TMemoizedFunction<T> = (...args: any[]) => T;

type TMakeKeyFunciton = (...args: any[]) => string;

const createCacheKey: TMakeKeyFunciton = (...args: any[]) => JSON.stringify(args);

const memoize = <T>(fn: (...args: any[]) => T): TMemoizedFunction<T> => {
  const cache: Map<string, T> = new Map();

  return (...args: any[]): T => {
    const key: string = createCacheKey(...args);

    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }

    return cache.get(key)!;
  };
};

export default memoize;
