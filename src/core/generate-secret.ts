export type RandomSource = () => number;

export const generateSecret = (
  _length: number,
  _base: number,
  _random: RandomSource = Math.random,
): string => {
  throw new Error('Not implemented');
};
