import type { BaseName } from './digits.js';
import type { GuessResult } from './evaluate-guess.js';

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

const notImplemented = (): never => {
  throw new Error('Not implemented');
};

export const availableLengths = (_base: BaseName): number[] => notImplemented();
export const createInitialState = (_settings?: Settings): GameState => notImplemented();
export const updateSettings = (_state: GameState, _patch: Partial<Settings>): GameState =>
  notImplemented();
export const startGame = (_state: GameState, _secret: string, _now: number): GameState =>
  notImplemented();
export const submitGuess = (_state: GameState, _guess: string, _now: number): GuessOutcome =>
  notImplemented();
export const elapsedMs = (_state: GameState, _now: number): number => notImplemented();
export const resetGame = (_state: GameState): GameState => notImplemented();
