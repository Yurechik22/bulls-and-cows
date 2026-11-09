import { describe, expect, it, vi } from 'vitest';
import { countPossibleSecrets } from '../src/core/count-possible-secrets';
import { memoize } from '../src/core/memoize';

const factorial = (n: number): number =>
  Array.from({ length: n }, (_, index) => index + 1).reduce((product, k) => product * k, 1);

describe('countPossibleSecrets', () => {
  it('counts permutations for well-known cases', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(2, 2)).toBe(2);
    expect(countPossibleSecrets(3, 8)).toBe(336);
    expect(countPossibleSecrets(6, 16)).toBe(5765760);
  });

  it('matches base! / (base - length)! for every game setting', () => {
    [2, 8, 10, 16].forEach((base) => {
      [2, 3, 4, 5, 6]
        .filter((length) => length <= base)
        .forEach((length) => {
          expect(countPossibleSecrets(length, base)).toBe(
            factorial(base) / factorial(base - length),
          );
        });
    });
  });

  it('handles the edge cases of the recursion', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
    expect(countPossibleSecrets(1, 10)).toBe(10);
    expect(countPossibleSecrets(3, 2)).toBe(0);
  });
});

describe('memoize', () => {
  it('calls the original function only once for the same arguments', () => {
    const add = vi.fn((a: number, b: number) => a + b);
    const memoizedAdd = memoize(add);

    expect(memoizedAdd(1, 2)).toBe(3);
    expect(memoizedAdd(1, 2)).toBe(3);
    expect(add).toHaveBeenCalledTimes(1);
  });

  it('keeps separate results for different arguments', () => {
    const add = vi.fn((a: number, b: number) => a + b);
    const memoizedAdd = memoize(add);

    expect(memoizedAdd(1, 2)).toBe(3);
    expect(memoizedAdd(2, 1)).toBe(3);
    expect(memoizedAdd(12, 3)).toBe(15);
    expect(add).toHaveBeenCalledTimes(3);
  });
});
