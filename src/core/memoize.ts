type Key = string | number;

export const memoize = <Args extends readonly Key[], Result>(
  fn: (...args: Args) => Result,
): ((...args: Args) => Result) => fn;
