import { BASES, type BaseName } from './digits.js';
import { evaluateGuess, type GuessResult } from './evaluate-guess.js';
import { isValidGuess } from './is-valid-guess.js';

export const MIN_LENGTH = 2;
export const MAX_LENGTH = 6;

export type Settings = Readonly<{ length: number; base: BaseName }>;
export type Attempt = Readonly<GuessResult & { guess: string }>;
export type Status = 'setup' | 'playing' | 'won';

export type GameState = Readonly<{
  settings: Settings;
  status: Status;
  secret: string;
  history: readonly Attempt[];
  startedAt: number | null;
  finishedAt: number | null;
}>;

export type GuessError = 'invalid' | 'duplicate' | 'not-playing';
export type GuessOutcome = Readonly<{ state: GameState; error: GuessError | null }>;

export const DEFAULT_SETTINGS: Settings = { length: 4, base: 'dec' };

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

export const LENGTH_OPTIONS: readonly number[] = range(MIN_LENGTH, MAX_LENGTH);

export const availableLengths = (base: BaseName): number[] =>
  LENGTH_OPTIONS.filter((length) => length <= BASES[base]);

const fitLength = (settings: Settings): Settings => {
  const lengths = availableLengths(settings.base);
  const length = Math.min(Math.max(settings.length, lengths[0]), lengths[lengths.length - 1]);
  return length === settings.length ? settings : { ...settings, length };
};

export const createInitialState = (settings: Settings = DEFAULT_SETTINGS): GameState => ({
  settings: fitLength(settings),
  status: 'setup',
  secret: '',
  history: [],
  startedAt: null,
  finishedAt: null,
});

export const updateSettings = (state: GameState, patch: Partial<Settings>): GameState =>
  state.status === 'setup'
    ? { ...state, settings: fitLength({ ...state.settings, ...patch }) }
    : state;

export const startGame = (state: GameState, secret: string, now: number): GameState =>
  state.status === 'setup'
    ? {
        ...state,
        status: 'playing',
        secret: secret.toLowerCase(),
        history: [],
        startedAt: now,
        finishedAt: null,
      }
    : state;

export const submitGuess = (state: GameState, rawGuess: string, now: number): GuessOutcome => {
  if (state.status !== 'playing') return { state, error: 'not-playing' };

  const guess = rawGuess.toLowerCase();
  const { length, base } = state.settings;

  if (!isValidGuess(guess, length, BASES[base])) return { state, error: 'invalid' };
  if (state.history.some((attempt) => attempt.guess === guess)) {
    return { state, error: 'duplicate' };
  }

  const attempt: Attempt = { guess, ...evaluateGuess(state.secret, guess) };
  const isWin = attempt.bulls === length;

  return {
    state: {
      ...state,
      history: [...state.history, attempt],
      status: isWin ? 'won' : 'playing',
      finishedAt: isWin ? now : null,
    },
    error: null,
  };
};

export const elapsedMs = (state: GameState, now: number): number =>
  state.startedAt === null ? 0 : (state.finishedAt ?? now) - state.startedAt;

export const resetGame = (state: GameState): GameState => createInitialState(state.settings);
