import { BASES } from '../core/digits.js';
import {
  createInitialState,
  resetGame,
  startGame,
  submitGuess,
  updateSettings,
  type GameState,
} from '../core/game-state.js';
import { generateSecret } from '../core/generate-secret.js';
import { addScore, createScore, type ScoreEntry } from '../core/leaderboard.js';
import type { Actions } from './actions.js';
import { renderGame } from './screens/game.js';
import { renderResult } from './screens/result.js';
import { renderSettings } from './screens/settings.js';
import { loadBoard, saveBoard } from './storage.js';

const TIMER_INTERVAL_MS = 1000;

export const mountApp = (root: HTMLElement): void => {
  // The UI shell keeps a reference to the latest immutable state; the core never mutates it.
  let state: GameState = createInitialState();
  let board: readonly ScoreEntry[] = loadBoard(state.settings);
  let lastScore: ScoreEntry | null = null;
  let timerId: number | undefined;

  const render = (): void => {
    window.clearInterval(timerId);

    if (state.status === 'playing') {
      const view = renderGame(state, actions, Date.now);
      root.replaceChildren(view.element);
      view.focus();
      timerId = window.setInterval(view.updateTimer, TIMER_INTERVAL_MS);
      return;
    }

    root.replaceChildren(
      state.status === 'won'
        ? renderResult(state, board, lastScore, actions)
        : renderSettings(state, board, actions),
    );
  };

  const update = (next: GameState): void => {
    state = next;
    board = loadBoard(state.settings);
    render();
  };

  const actions: Actions = {
    changeSettings: (patch) => update(updateSettings(state, patch)),

    start: () => {
      const { length, base } = state.settings;
      lastScore = null;
      update(startGame(state, generateSecret(length, BASES[base]), Date.now()));
    },

    guess: (value) => {
      const outcome = submitGuess(state, value, Date.now());
      if (outcome.error) return outcome.error;

      if (outcome.state.status === 'won') {
        const score = createScore(outcome.state);
        const nextBoard = addScore(loadBoard(outcome.state.settings), score);
        saveBoard(outcome.state.settings, nextBoard);
        state = outcome.state;
        board = nextBoard;
        lastScore = score;
        render();
        return null;
      }

      update(outcome.state);
      return null;
    },

    newGame: () => update(resetGame(state)),
  };

  render();
};
