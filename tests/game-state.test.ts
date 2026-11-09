import { describe, expect, it } from 'vitest';
import {
  availableLengths,
  createInitialState,
  elapsedMs,
  resetGame,
  startGame,
  submitGuess,
  updateSettings,
} from '../src/core/game-state';

const playing = () => startGame(createInitialState({ length: 4, base: 'dec' }), '1234', 1000);

describe('settings', () => {
  it('starts on the settings screen with an empty history', () => {
    const state = createInitialState();
    expect(state.status).toBe('setup');
    expect(state.history).toEqual([]);
  });

  it('allows only length 2 for binary and 2-6 for other bases', () => {
    expect(availableLengths('bin')).toEqual([2]);
    expect(availableLengths('oct')).toEqual([2, 3, 4, 5, 6]);
    expect(availableLengths('hex')).toEqual([2, 3, 4, 5, 6]);
  });

  it('clamps the length to 2 when binary is selected', () => {
    const state = updateSettings(createInitialState({ length: 5, base: 'dec' }), { base: 'bin' });
    expect(state.settings).toEqual({ length: 2, base: 'bin' });
  });

  it('returns a new state object and keeps the old one unchanged', () => {
    const before = createInitialState({ length: 4, base: 'dec' });
    const after = updateSettings(before, { length: 6 });
    expect(after.settings.length).toBe(6);
    expect(before.settings.length).toBe(4);
  });

  it('locks settings after the round starts', () => {
    const state = playing();
    expect(updateSettings(state, { base: 'hex', length: 6 })).toBe(state);
  });
});

describe('submitGuess', () => {
  it('appends an attempt to a new history array', () => {
    const before = playing();
    const { state: after, error } = submitGuess(before, '1243', 2000);

    expect(error).toBeNull();
    expect(after.history).toEqual([{ guess: '1243', bulls: 2, cows: 2 }]);
    expect(after.history).not.toBe(before.history);
    expect(before.history).toEqual([]);
  });

  it('keeps earlier attempts untouched', () => {
    const first = submitGuess(playing(), '5678', 2000).state;
    const second = submitGuess(first, '1243', 3000).state;
    expect(second.history[0]).toBe(first.history[0]);
    expect(second.history).toHaveLength(2);
  });

  it('rejects an invalid guess without changing the state', () => {
    const state = playing();
    expect(submitGuess(state, '1123', 2000)).toEqual({ state, error: 'invalid' });
  });

  it('does not duplicate a repeated guess, ignoring letter case', () => {
    const hexGame = startGame(createInitialState({ length: 4, base: 'hex' }), 'abcd', 0);
    const first = submitGuess(hexGame, 'ab12', 1000).state;
    const repeated = submitGuess(first, 'AB12', 2000);
    expect(repeated.error).toBe('duplicate');
    expect(repeated.state.history).toHaveLength(1);
  });

  it('wins when all digits are bulls and stores the finish time', () => {
    const { state } = submitGuess(playing(), '1234', 61000);
    expect(state.status).toBe('won');
    expect(state.finishedAt).toBe(61000);
    expect(elapsedMs(state, 99999)).toBe(60000);
  });

  it('ignores guesses after the round is won', () => {
    const won = submitGuess(playing(), '1234', 2000).state;
    expect(submitGuess(won, '4321', 3000).error).toBe('not-playing');
  });
});

describe('resetGame', () => {
  it('returns to the settings screen and keeps the chosen settings', () => {
    const won = submitGuess(playing(), '1234', 2000).state;
    const fresh = resetGame(won);
    expect(fresh.status).toBe('setup');
    expect(fresh.history).toEqual([]);
    expect(fresh.settings).toEqual(won.settings);
  });
});
