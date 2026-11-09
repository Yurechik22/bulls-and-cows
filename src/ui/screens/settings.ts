import { countPossibleSecrets } from '../../core/count-possible-secrets.js';
import { BASES, BASE_NAMES } from '../../core/digits.js';
import { describeDigits } from '../../core/format.js';
import { LENGTH_OPTIONS, availableLengths, type GameState } from '../../core/game-state.js';
import type { ScoreEntry } from '../../core/leaderboard.js';
import type { Actions } from '../actions.js';
import { renderLeaderboard } from '../components.js';
import { el } from '../dom.js';

const chip = (label: string, active: boolean, disabled: boolean, onClick: () => void) =>
  el('button', {
    className: active ? 'chip active' : 'chip',
    text: label,
    attrs: { type: 'button', 'aria-pressed': String(active), disabled },
    on: { click: onClick },
  });

export const renderSettings = (
  state: GameState,
  board: readonly ScoreEntry[],
  actions: Actions,
): HTMLElement => {
  const { base, length } = state.settings;
  const lengths = availableLengths(base);

  const baseChips = BASE_NAMES.map((name) =>
    chip(`${name} (${BASES[name]})`, name === base, false, () =>
      actions.changeSettings({ base: name }),
    ),
  );

  const lengthChips = LENGTH_OPTIONS.map((value) =>
    chip(String(value), value === length, !lengths.includes(value), () =>
      actions.changeSettings({ length: value }),
    ),
  );

  return el('div', { className: 'screen' }, [
    el('header', { className: 'hero' }, [
      el('h1', { text: 'Bulls & Cows' }),
      el('p', {
        className: 'muted',
        text: 'Guess the secret number of unique digits. Bull — right digit in the right place, cow — right digit in the wrong place.',
      }),
    ]),
    el('section', { className: 'card' }, [
      el('h2', { text: 'Settings' }),
      el('div', { className: 'field' }, [
        el('span', { className: 'label', text: 'Base' }),
        el('div', { className: 'chips' }, baseChips),
      ]),
      el('div', { className: 'field' }, [
        el('span', { className: 'label', text: 'Length' }),
        el('div', { className: 'chips' }, lengthChips),
      ]),
      el('p', {
        className: 'muted',
        text: `Digits: ${describeDigits(BASES[base])}. Possible secrets: ${countPossibleSecrets(length, BASES[base]).toLocaleString('en-US')}.`,
      }),
      el('button', {
        className: 'btn primary',
        text: 'Start game',
        attrs: { type: 'button' },
        on: { click: actions.start },
      }),
    ]),
    renderLeaderboard(board, state.settings),
  ]);
};
