import { BASES, type BaseName } from './digits.js';
import { elapsedMs, type GameState, type Settings } from './game-state.js';

export const LEADERBOARD_SIZE = 10;

export type ScoreEntry = Readonly<{
  attempts: number;
  timeMs: number;
  date: number;
  length: number;
  base: BaseName;
}>;

export const compareScores = (a: ScoreEntry, b: ScoreEntry): number =>
  a.attempts - b.attempts || a.timeMs - b.timeMs;

export const addScore = (
  board: readonly ScoreEntry[],
  entry: ScoreEntry,
  limit: number = LEADERBOARD_SIZE,
): ScoreEntry[] => [...board, entry].sort(compareScores).slice(0, limit);

export const createScore = (state: GameState): ScoreEntry => {
  const finishedAt = state.finishedAt ?? state.startedAt ?? 0;
  return {
    attempts: state.history.length,
    timeMs: elapsedMs(state, finishedAt),
    date: finishedAt,
    length: state.settings.length,
    base: state.settings.base,
  };
};

export const leaderboardKey = (settings: Settings): string =>
  `bulls-and-cows:leaderboard:${settings.base}-${settings.length}`;

const NUMBER_FIELDS = ['attempts', 'timeMs', 'date', 'length'] as const;

const isScoreEntry = (value: unknown): value is ScoreEntry => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    NUMBER_FIELDS.every((field) => typeof record[field] === 'number') &&
    typeof record.base === 'string' &&
    record.base in BASES
  );
};

export const parseBoard = (raw: string | null): ScoreEntry[] => {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isScoreEntry).sort(compareScores) : [];
  } catch {
    return [];
  }
};
