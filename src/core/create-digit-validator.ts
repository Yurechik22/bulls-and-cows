import { digitsOf } from './digits.js';

export type DigitValidator = (char: string) => boolean;

export const createDigitValidator = (base: number): DigitValidator => {
  const allowed = new Set(digitsOf(base));
  return (char) => char.length === 1 && allowed.has(char.toLowerCase());
};
