import { memoize } from './memoize.js';

// P(base, length) = base * P(base - 1, length - 1), P(base, 0) = 1
export const countPossibleSecrets: (length: number, base: number) => number = memoize(
  (length: number, base: number): number => {
    if (length < 0 || length > base) return 0;
    if (length === 0) return 1;
    return base * countPossibleSecrets(length - 1, base - 1);
  },
);
