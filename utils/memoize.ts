type TMemoizedFunction<T> = (...args: any[]) => T;

type TMakeKeyFunciton = (...args: any[]) => string;

/**
 * Function that creates a cache key based on the provided arguments.
 * @param args The arguments to generate the cache key from.
 * @returns The cache key as a string.
 */
const createCacheKey: TMakeKeyFunciton = (...args: any[]) => JSON.stringify(args);

/**
 * Function that memoizes the provided function.
 * @param func The function to memoize.
 * @returns The memoized function.
 */
const memoize = <T>(func: (...args: any[]) => T): TMemoizedFunction<T> => {
  const cache: Map<string, T> = new Map();

  return (...args: any[]): T => {
    const key: string = createCacheKey(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);

    return result;
  };
};

export default memoize;
