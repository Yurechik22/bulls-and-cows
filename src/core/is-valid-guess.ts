import { createDigitValidator } from './create-digit-validator.js';
import { toChars } from './digits.js';

const hasUniqueItems = (items: readonly string[]): boolean => new Set(items).size === items.length;

export const isValidGuess = (guess: string, length: number, base: number): boolean => {
  const chars = toChars(guess);
  return (
    chars.length === length && chars.every(createDigitValidator(base)) && hasUniqueItems(chars)
  );
};
