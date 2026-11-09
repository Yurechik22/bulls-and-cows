import { describe, expect, it } from 'vitest';
import { generateSecret } from '../src/core/generate-secret';

const sequence =
  (...values: number[]) =>
  (): number => {
    const value = values.shift() ?? 0;
    values.push(value);
    return value;
  };

const always = (value: number) => (): number => value;

describe('generateSecret', () => {
  it('picks the smallest digits when random always returns 0 and keeps the leading zero', () => {
    expect(generateSecret(4, 10, always(0))).toBe('0123');
  });

  it('picks the largest digits when random is close to 1', () => {
    expect(generateSecret(4, 10, always(0.99999))).toBe('9876');
  });

  it('uses the injected random source step by step', () => {
    expect(generateSecret(4, 10, sequence(0.5, 0.1, 0.9, 0.3))).toBe('5093');
  });

  it('is repeatable with the same random sequence', () => {
    const first = generateSecret(5, 16, sequence(0.2, 0.7, 0.4));
    const second = generateSecret(5, 16, sequence(0.2, 0.7, 0.4));
    expect(first).toBe(second);
  });

  it('works for binary', () => {
    expect(generateSecret(2, 2, always(0))).toBe('01');
    expect(generateSecret(2, 2, always(0.99))).toBe('10');
  });

  it('uses lowercase letters for hex', () => {
    expect(generateSecret(3, 16, always(0.99))).toBe('fed');
  });

  it('returns unique digits of the base with the default random source', () => {
    const secret = generateSecret(6, 8);
    expect(secret).toHaveLength(6);
    expect(new Set(secret).size).toBe(6);
    expect(secret).toMatch(/^[0-7]+$/);
  });

  it('throws a RangeError for impossible settings', () => {
    expect(() => generateSecret(3, 2)).toThrow(RangeError);
    expect(() => generateSecret(0, 10)).toThrow(RangeError);
    expect(() => generateSecret(4, 17)).toThrow(RangeError);
  });
});
