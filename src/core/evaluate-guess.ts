export type GuessResult = Readonly<{ bulls: number; cows: number }>;

export const evaluateGuess = (_secret: string, _guess: string): GuessResult => {
  throw new Error('Not implemented');
};
