type TMemoizedFunction<T> = (...args: any[]) => T;

type TMakeKeyFunciton = (...args: any[]) => string;

const createCacheKey: TMakeKeyFunciton = (...args: any[]) => JSON.stringify(args);

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
