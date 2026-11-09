import { toChars } from './digits.js';

export type GuessResult = Readonly<{ bulls: number; cows: number }>;

export const evaluateGuess = (secret: string, guess: string): GuessResult => {
  const secretChars = toChars(secret);
  const secretSet = new Set(secretChars);
  const guessChars = toChars(guess);

  const bulls = guessChars.filter((char, index) => char === secretChars[index]).length;
  const matches = guessChars.reduce((sum, char) => sum + Number(secretSet.has(char)), 0);

  return { bulls, cows: matches - bulls };
};
