import { formatTime } from '../../core/format.js';
import { elapsedMs, type GameState } from '../../core/game-state.js';
import type { ScoreEntry } from '../../core/leaderboard.js';
import type { Actions } from '../actions.js';
import { renderHistory, renderLeaderboard } from '../components.js';
import { el } from '../dom.js';

export const renderResult = (
  state: GameState,
  board: readonly ScoreEntry[],
  lastScore: ScoreEntry | null,
  actions: Actions,
): HTMLElement => {
  const place = lastScore ? board.indexOf(lastScore) + 1 : 0;
  const placeText =
    place > 0 ? `Your place in the leaderboard: #${place}` : 'Not in the top this time.';

  return el('div', { className: 'screen' }, [
    el('section', { className: 'card win' }, [
      el('h1', { text: '🎉 You cracked it!' }),
      el('p', { className: 'secret mono', text: state.secret }),
      el('div', { className: 'stats' }, [
        el('div', { className: 'stat' }, [
          el('span', { className: 'label', text: 'Attempts' }),
          el('span', { className: 'stat-value', text: String(state.history.length) }),
        ]),
        el('div', { className: 'stat' }, [
          el('span', { className: 'label', text: 'Time' }),
          el('span', {
            className: 'stat-value mono',
            text: formatTime(elapsedMs(state, state.finishedAt ?? 0)),
          }),
        ]),
      ]),
      el('p', { className: 'muted', text: placeText }),
      el('button', {
        className: 'btn primary',
        text: 'New game',
        attrs: { type: 'button', autofocus: true },
        on: { click: actions.newGame },
      }),
    ]),
    renderLeaderboard(board, state.settings, lastScore),
    el('section', { className: 'card' }, [
      el('h2', { text: 'Your attempts' }),
      renderHistory(state.history),
    ]),
  ]);
};
