import { createDigitValidator } from '../../core/create-digit-validator.js';
import { BASES } from '../../core/digits.js';
import { describeDigits, formatTime } from '../../core/format.js';
import { elapsedMs, type GameState, type GuessError } from '../../core/game-state.js';
import { isValidGuess } from '../../core/is-valid-guess.js';
import type { Actions } from '../actions.js';
import { renderHistory } from '../components.js';
import { el } from '../dom.js';

export type GameView = Readonly<{
  element: HTMLElement;
  updateTimer: () => void;
  focus: () => void;
}>;

const stat = (label: string, value: HTMLElement | string) =>
  el('div', { className: 'stat' }, [
    el('span', { className: 'label', text: label }),
    typeof value === 'string' ? el('span', { className: 'stat-value', text: value }) : value,
  ]);

export const renderGame = (state: GameState, actions: Actions, now: () => number): GameView => {
  const { base, length } = state.settings;
  const radix = BASES[base];
  const isDigit = createDigitValidator(radix);
  const digitsHint = describeDigits(radix);

  const errorText: Record<GuessError, string> = {
    invalid: `Enter ${length} different digits (${digitsHint}).`,
    duplicate: 'You have already tried this number — try another one.',
    'not-playing': 'The round is over.',
  };

  const timer = el('span', {
    className: 'stat-value mono',
    text: formatTime(elapsedMs(state, now())),
  });
  const message = el('p', { className: 'message', attrs: { 'aria-live': 'polite' } });
  const submit = el('button', {
    className: 'btn primary',
    text: 'Check',
    attrs: { type: 'submit', disabled: true },
  });
  const input = el('input', {
    className: 'guess-input mono',
    attrs: {
      type: 'text',
      maxlength: String(length),
      autocomplete: 'off',
      spellcheck: 'false',
      inputmode: radix <= 10 ? 'numeric' : 'text',
      placeholder: '•'.repeat(length),
      'aria-label': 'Your guess',
    },
  });

  const sanitize = (value: string): string => [...value].filter(isDigit).join('').slice(0, length);

  input.addEventListener('input', () => {
    const clean = sanitize(input.value);
    const hadInvalidChars = clean !== input.value;
    input.value = clean;

    const valid = isValidGuess(clean, length, radix);
    submit.disabled = !valid;

    if (hadInvalidChars) message.textContent = `Only digits ${digitsHint} are allowed.`;
    else if (clean.length === length && !valid) message.textContent = 'Digits must not repeat.';
    else message.textContent = '';
  });

  const form = el(
    'form',
    {
      className: 'guess-form',
      on: {
        submit: (event) => {
          event.preventDefault();
          const error = actions.guess(input.value);
          if (error) {
            message.textContent = errorText[error];
            input.select();
          }
        },
      },
    },
    [input, submit],
  );

  const element = el('div', { className: 'screen' }, [
    el('section', { className: 'card' }, [
      el('div', { className: 'stats' }, [
        stat('Base', `${base} 🔒`),
        stat('Length', `${length} 🔒`),
        stat('Attempts', String(state.history.length)),
        stat('Time', timer),
      ]),
      el('p', { className: 'muted', text: `Allowed digits: ${digitsHint}. Settings are locked.` }),
      form,
      message,
    ]),
    el('section', { className: 'card' }, [
      el('h2', { text: 'History' }),
      renderHistory(state.history),
    ]),
    el('button', {
      className: 'btn ghost',
      text: 'Give up · New game',
      attrs: { type: 'button' },
      on: { click: actions.newGame },
    }),
  ]);

  return {
    element,
    updateTimer: () => {
      timer.textContent = formatTime(elapsedMs(state, now()));
    },
    focus: () => input.focus(),
  };
};
