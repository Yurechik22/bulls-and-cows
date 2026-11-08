import { MAX_BASE, digitsOf } from './digits.js';

export type RandomSource = () => number;

const pickIndex = (size: number, random: RandomSource): number =>
  Math.min(Math.max(Math.floor(random() * size), 0), size - 1);

const removeAt = <T>(items: readonly T[], index: number): T[] => [
  ...items.slice(0, index),
  ...items.slice(index + 1),
];

const pickUnique = (pool: readonly string[], count: number, random: RandomSource): string[] => {
  if (count === 0) return [];
  const index = pickIndex(pool.length, random);
  return [pool[index], ...pickUnique(removeAt(pool, index), count - 1, random)];
};

export const generateSecret = (
  length: number,
  base: number,
  random: RandomSource = Math.random,
): string => {
  if (!Number.isInteger(base) || base < 1 || base > MAX_BASE) {
    throw new RangeError(`Unsupported base: ${base}`);
  }
  if (!Number.isInteger(length) || length < 1 || length > base) {
    throw new RangeError(`Length must be between 1 and ${base}, got ${length}`);
  }
  return pickUnique(digitsOf(base), length, random).join('');
};
