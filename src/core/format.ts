const pad = (value: number): string => String(value).padStart(2, '0');

export const formatTime = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(totalSeconds / 60))}:${pad(totalSeconds % 60)}`;
};

export const describeDigits = (base: number): string =>
  base <= 10 ? `0–${base - 1}` : `0–9, a–${'abcdef'[base - 11]}`;
