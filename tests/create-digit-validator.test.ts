import { describe, expect, it } from 'vitest';
import { createDigitValidator } from '../src/core/create-digit-validator';

describe('createDigitValidator', () => {
  it('accepts only 0 and 1 for binary', () => {
    const isBinaryDigit = createDigitValidator(2);
    expect(['0', '1'].every(isBinaryDigit)).toBe(true);
    expect(['2', '9', 'a'].some(isBinaryDigit)).toBe(false);
  });

  it('accepts 0-7 for octal and rejects 8 and 9', () => {
    const isOctalDigit = createDigitValidator(8);
    expect([...'01234567'].every(isOctalDigit)).toBe(true);
    expect(['8', '9'].some(isOctalDigit)).toBe(false);
  });

  it('accepts 0-9 for decimal and rejects letters', () => {
    const isDecimalDigit = createDigitValidator(10);
    expect([...'0123456789'].every(isDecimalDigit)).toBe(true);
    expect(['a', 'f', 'x'].some(isDecimalDigit)).toBe(false);
  });

  it('accepts hex digits case-insensitively', () => {
    const isHexDigit = createDigitValidator(16);
    expect([...'0123456789abcdefABCDEF'].every(isHexDigit)).toBe(true);
    expect(['g', 'G', 'z'].some(isHexDigit)).toBe(false);
  });

  it('rejects empty strings, several characters and non-digit symbols', () => {
    const isDecimalDigit = createDigitValidator(10);
    expect(['', '12', ' ', '-', '.'].some(isDecimalDigit)).toBe(false);
  });
});
