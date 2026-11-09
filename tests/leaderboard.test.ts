import { describe, expect, it } from 'vitest';
import {
  addScore,
  createScore,
  leaderboardKey,
  parseBoard,
  type ScoreEntry,
} from '../src/core/leaderboard';
import { createInitialState, startGame, submitGuess } from '../src/core/game-state';

const score = (attempts: number, timeMs: number): ScoreEntry => ({
  attempts,
  timeMs,
  date: 0,
  length: 4,
  base: 'dec',
});

describe('addScore', () => {
  it('sorts by attempts first and then by time', () => {
    const board = [score(5, 1000), score(3, 9000)];
    expect(addScore(board, score(3, 2000))).toEqual([
      score(3, 2000),
      score(3, 9000),
      score(5, 1000),
    ]);
  });

  it('keeps only the top N results', () => {
    const board = [score(1, 1), score(2, 1), score(3, 1)];
    expect(addScore(board, score(4, 1), 3)).toEqual(board);
  });

  it('does not mutate the original board', () => {
    const board = [score(5, 1000)];
    addScore(board, score(1, 1));
    expect(board).toEqual([score(5, 1000)]);
  });
});

describe('createScore', () => {
  it('takes attempts, time and settings from a won game', () => {
    const game = startGame(createInitialState({ length: 4, base: 'dec' }), '1234', 1000);
    const afterMiss = submitGuess(game, '5678', 2000).state;
    const won = submitGuess(afterMiss, '1234', 11000).state;
    expect(createScore(won)).toEqual({
      attempts: 2,
      timeMs: 10000,
      date: 11000,
      length: 4,
      base: 'dec',
    });
  });
});

describe('storage helpers', () => {
  it('builds a separate key for every base and length', () => {
    expect(leaderboardKey({ base: 'hex', length: 5 })).toBe('bulls-and-cows:leaderboard:hex-5');
  });

  it('parses a saved board', () => {
    expect(parseBoard(JSON.stringify([score(4, 1), score(2, 1)]))).toEqual([
      score(2, 1),
      score(4, 1),
    ]);
  });

  it('returns an empty board for missing or broken data', () => {
    expect(parseBoard(null)).toEqual([]);
    expect(parseBoard('not json')).toEqual([]);
    expect(parseBoard('{"a":1}')).toEqual([]);
    expect(parseBoard('[{"attempts":"x"}]')).toEqual([]);
  });
});
