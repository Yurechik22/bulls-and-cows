import type { BaseName } from './digits.js';
import type { GameState, Settings } from './game-state.js';

export type ScoreEntry = Readonly<{
  attempts: number;
  timeMs: number;
  date: number;
  length: number;
  base: BaseName;
}>;

const notImplemented = (): never => {
  throw new Error('Not implemented');
};

export const addScore = (
  _board: readonly ScoreEntry[],
  _entry: ScoreEntry,
  _limit?: number,
): ScoreEntry[] => notImplemented();
export const createScore = (_state: GameState): ScoreEntry => notImplemented();
export const leaderboardKey = (_settings: Settings): string => notImplemented();
export const parseBoard = (_raw: string | null): ScoreEntry[] => notImplemented();
