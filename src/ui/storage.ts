import type { Settings } from '../core/game-state.js';
import { leaderboardKey, parseBoard, type ScoreEntry } from '../core/leaderboard.js';

export const loadBoard = (settings: Settings): ScoreEntry[] => {
  try {
    return parseBoard(localStorage.getItem(leaderboardKey(settings)));
  } catch {
    return [];
  }
};

export const saveBoard = (settings: Settings, board: readonly ScoreEntry[]): void => {
  try {
    localStorage.setItem(leaderboardKey(settings), JSON.stringify(board));
  } catch {
    // Storage can be unavailable (private mode, quota). The game still works without it.
  }
};
