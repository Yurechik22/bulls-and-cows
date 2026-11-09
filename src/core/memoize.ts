type Key = string | number;

export const memoize = <Args extends readonly Key[], Result>(
  fn: (...args: Args) => Result,
): ((...args: Args) => Result) => {
  const cache = new Map<string, Result>();

  return (...args: Args): Result => {
    const key = args.join('|');
    if (cache.has(key)) return cache.get(key) as Result;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
