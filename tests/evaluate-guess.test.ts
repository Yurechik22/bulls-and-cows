import { describe, expect, it } from 'vitest';
import { evaluateGuess } from '../src/core/evaluate-guess';

describe('evaluateGuess', () => {
  it('counts only bulls when the guess equals the secret', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('counts only cows when all digits are in the wrong positions', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('returns zeros when no digits match', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('counts bulls and cows together', () => {
    expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
    expect(evaluateGuess('1234', '1356')).toEqual({ bulls: 1, cows: 1 });
  });

  it('keeps leading zeros meaningful', () => {
    expect(evaluateGuess('0123', '0321')).toEqual({ bulls: 2, cows: 2 });
  });

  it('compares hex digits case-insensitively', () => {
    expect(evaluateGuess('ab12', 'AB21')).toEqual({ bulls: 2, cows: 2 });
  });

  it('gives the same result when secret and guess swap places', () => {
    expect(evaluateGuess('5093', '3905')).toEqual(evaluateGuess('3905', '5093'));
  });
});
