export type BaseName = 'bin' | 'oct' | 'dec' | 'hex';

export const BASES: Readonly<Record<BaseName, number>> = { bin: 2, oct: 8, dec: 10, hex: 16 };

export const BASE_NAMES = Object.keys(BASES) as readonly BaseName[];

const ALL_DIGITS = '0123456789abcdef';

export const MAX_BASE = ALL_DIGITS.length;

export const digitsOf = (base: number): readonly string[] => [...ALL_DIGITS.slice(0, base)];

export const toChars = (value: string): string[] => [...value.toLowerCase()];
