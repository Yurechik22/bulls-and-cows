import { formatTime } from '../core/format.js';
import type { Attempt, Settings } from '../core/game-state.js';
import type { ScoreEntry } from '../core/leaderboard.js';
import { el } from './dom.js';

const headRow = (titles: readonly string[]): HTMLTableSectionElement =>
  el('thead', {}, [
    el(
      'tr',
      {},
      titles.map((title) => el('th', { text: title })),
    ),
  ]);

export const renderHistory = (history: readonly Attempt[]): HTMLElement => {
  if (history.length === 0) {
    return el('p', { className: 'muted', text: 'No attempts yet — make your first guess!' });
  }

  const rows = history
    .map((attempt, index) =>
      el('tr', {}, [
        el('td', { className: 'muted', text: String(index + 1) }),
        el('td', { className: 'mono guess', text: attempt.guess }),
        el('td', { className: 'bulls', text: String(attempt.bulls) }),
        el('td', { className: 'cows', text: String(attempt.cows) }),
      ]),
    )
    .reverse();

  return el('table', { className: 'table' }, [
    headRow(['#', 'Guess', 'Bulls 🐂', 'Cows 🐄']),
    el('tbody', {}, rows),
  ]);
};

export const renderLeaderboard = (
  board: readonly ScoreEntry[],
  settings: Settings,
  highlight: ScoreEntry | null = null,
): HTMLElement => {
  const title = el('h2', { text: `🏆 Top results · ${settings.base} · ${settings.length} digits` });

  if (board.length === 0) {
    return el('section', { className: 'card' }, [
      title,
      el('p', { className: 'muted', text: 'No results yet. Be the first!' }),
    ]);
  }

  const rows = board.map((entry, index) =>
    el('tr', { className: entry === highlight ? 'highlight' : '' }, [
      el('td', { text: String(index + 1) }),
      el('td', { text: String(entry.attempts) }),
      el('td', { className: 'mono', text: formatTime(entry.timeMs) }),
      el('td', { className: 'muted', text: new Date(entry.date).toLocaleDateString() }),
    ]),
  );

  return el('section', { className: 'card' }, [
    title,
    el('table', { className: 'table' }, [
      headRow(['Place', 'Attempts', 'Time', 'Date']),
      el('tbody', {}, rows),
    ]),
  ]);
};
