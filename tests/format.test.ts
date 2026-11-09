import { describe, expect, it } from 'vitest';
import { describeDigits, formatTime } from '../src/core/format';

describe('formatTime', () => {
  it('formats milliseconds as mm:ss', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(59999)).toBe('00:59');
    expect(formatTime(61000)).toBe('01:01');
    expect(formatTime(3600000)).toBe('60:00');
  });

  it('never shows negative time', () => {
    expect(formatTime(-5000)).toBe('00:00');
  });
});

describe('describeDigits', () => {
  it('describes allowed digits for every base', () => {
    expect(describeDigits(2)).toBe('0–1');
    expect(describeDigits(8)).toBe('0–7');
    expect(describeDigits(10)).toBe('0–9');
    expect(describeDigits(16)).toBe('0–9, a–f');
  });
});
