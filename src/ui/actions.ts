import type { GuessError, Settings } from '../core/game-state.js';

export type Actions = Readonly<{
  changeSettings: (patch: Partial<Settings>) => void;
  start: () => void;
  guess: (value: string) => GuessError | null;
  newGame: () => void;
}>;
