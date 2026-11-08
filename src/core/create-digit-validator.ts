export type DigitValidator = (char: string) => boolean;

export const createDigitValidator =
  (_base: number): DigitValidator =>
  () => {
    throw new Error('Not implemented');
  };
