import { describe, expect, it } from 'vitest';
import { isValidGuess } from '../src/core/is-valid-guess';

describe('isValidGuess', () => {
  it('accepts a guess of unique decimal digits with the right length', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
  });

  it('accepts a leading zero', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });

  it('rejects a guess with the wrong length', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
    expect(isValidGuess('12345', 4, 10)).toBe(false);
    expect(isValidGuess('', 4, 10)).toBe(false);
  });

  it('rejects repeated digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
  });

  it('rejects digits that do not belong to the base', () => {
    expect(isValidGuess('1238', 4, 8)).toBe(false);
    expect(isValidGuess('02', 2, 2)).toBe(false);
    expect(isValidGuess('12a4', 4, 10)).toBe(false);
  });

  it('accepts binary 01 and 10', () => {
    expect(isValidGuess('01', 2, 2)).toBe(true);
    expect(isValidGuess('10', 2, 2)).toBe(true);
  });

  it('accepts uppercase hex digits', () => {
    expect(isValidGuess('aB3F', 4, 16)).toBe(true);
  });

  it('treats the same hex letter in different cases as a repeat', () => {
    expect(isValidGuess('aA12', 4, 16)).toBe(false);
  });
});
