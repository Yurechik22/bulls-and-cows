# Bulls and Cows — Design

The project is split into two layers:

- `src/core/` — pure, DOM-free game logic (one responsibility per file). Fully covered by tests in `tests/`.
- `src/ui/` — the thin imperative shell: builds DOM nodes, handles events, talks to `localStorage`.

## 1. Data structures and algorithms

### Game state

```ts
type GameState = Readonly<{
  settings: Readonly<{ length: number; base: 'bin' | 'oct' | 'dec' | 'hex' }>;
  status: 'setup' | 'playing' | 'won';
  secret: string; // e.g. "0123" — a string keeps leading zeros
  history: readonly Attempt[]; // Attempt = { guess, bulls, cows }
  startedAt: number | null; // ms timestamps → elapsed time
  finishedAt: number | null;
}>;
```

- **Plain readonly object** instead of a class: it is easy to copy with spread, compare in tests with
  `toEqual` and serialize. `Readonly` types make accidental mutation a compile error.
- **`status` as a string union** — a tiny state machine (`setup → playing → won → setup`). Every
  transition is a pure function in `src/core/game-state.ts`: `updateSettings`, `startGame`,
  `submitGuess`, `resetGame`. Each returns a **new** object; `submitGuess` builds the history with
  `[...state.history, attempt]`, so old entries are never changed and the previous state stays valid.
- **History as an array** — attempts are naturally ordered, only appended, and rendered in order.
  Duplicate detection (`history.some(...)`) is linear, which is fine for a few dozen attempts.
- **Secret as a string** — leading zeros are preserved (`"0123"`), and digits are compared as
  lowercase characters, so hex is case-insensitive everywhere (`toChars` in `src/core/digits.ts`).
- **`Set` of allowed digits** in `createDigitValidator` — O(1) membership checks.
- **Leaderboard** — an array of `ScoreEntry` (`attempts`, `timeMs`, `date`, `length`, `base`)
  sorted by attempts, then time, cut to the top 10. There is a separate `localStorage` key per
  base/length combination (`bulls-and-cows:leaderboard:hex-4`), so results of different
  difficulty are never mixed. Saved data is validated by `parseBoard` before use.
- **`Map` cache** in `memoize` — key is the argument list joined into a string.

### `generateSecret(length, base, random = Math.random)` — `src/core/generate-secret.ts`

Recursive "draw without replacement": take the list of digits for the base, pick an index with
`random()`, put that digit into the result and recurse on the pool without it (`removeAt` builds a
new array, nothing is mutated). Because the random source is a parameter, tests pass deterministic
functions (`() => 0` gives `"0123"`).

### `evaluateGuess(secret, guess)` — `src/core/evaluate-guess.ts`

1. Lowercase both strings and split into characters.
2. **Bulls** — `filter` the guess characters that equal the secret character at the same index.
3. **Matches** — `reduce` over the guess counting characters that exist anywhere in the secret
   (lookup in a `Set` built from the secret).
4. **Cows = matches − bulls** (every bull is also a match). This works because digits are unique.

No manual counters or `for` loops — only `filter` and `reduce`.

### `isValidGuess(guess, length, base)` — `src/core/is-valid-guess.ts`

Three checks combined with `&&`: correct length, `every` character passes the validator from
`createDigitValidator(base)`, and `new Set(chars).size === chars.length` (no repeats).

### `createDigitValidator(base)` — `src/core/create-digit-validator.ts`

Curried factory `base => char => boolean`. It builds a `Set` of allowed digits once and returns a
predicate that lowercases the character. Used in two places: `isValidGuess` and live input
filtering in `src/ui/screens/game.ts` (`sanitize`).

### `countPossibleSecrets(length, base)` — `src/core/count-possible-secrets.ts`

Number of permutations without repetition, P(base, length) = base! / (base − length)!, computed by
the recurrence:

```
P(base, 0)      = 1
P(base, length) = 0                                  if length > base
P(base, length) = base · P(base − 1, length − 1)
```

The function is wrapped in a hand-written `memoize` HOF (`src/core/memoize.ts`), and the recursive
call goes through the memoized version, so every intermediate value is cached too.

## 2. Complexity

`L` — secret length (2…6), `B` — base (2…16).

| Function               | Time                                 | Why                                                                                                                                                                                                 |
| ---------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `generateSecret`       | **O(L · B)**                         | `L` recursive steps; each step copies the remaining pool (≤ B items) with `slice`/spread. Memory is also O(L · B) for the copies and recursion. With L ≤ 6 and B ≤ 16 this is effectively constant. |
| `evaluateGuess`        | **O(L)**                             | Splitting strings, building a `Set` of the secret, one `filter` and one `reduce` — each a single pass with O(1) `Set` lookups.                                                                      |
| `isValidGuess`         | **O(L + B)**                         | Building the validator's `Set` costs O(B); `every` and the uniqueness `Set` are O(L).                                                                                                               |
| `countPossibleSecrets` | **O(L)** first call, **O(1)** cached | Recursion depth is `L` with O(1) work per level (multiplication + a short cache key). After that the result for the same arguments comes from the `Map`. Extra memory: O(L) stack + cache.          |

## 3. Clean code principles

- **Single Responsibility** — every core function lives in its own file
  (`src/core/generate-secret.ts`, `evaluate-guess.ts`, `is-valid-guess.ts`,
  `create-digit-validator.ts`, `count-possible-secrets.ts`, `memoize.ts`); state transitions are in
  `game-state.ts`, scoring in `leaderboard.ts`, storage side effects only in `src/ui/storage.ts`.
- **Pure functions / no side effects** — everything in `src/core/` depends only on its arguments.
  Time (`now`) and randomness (`random`) are injected: `startGame(state, secret, now)`,
  `submitGuess(state, guess, now)`, `generateSecret(length, base, random)`.
- **Immutability** — `Readonly` types and spread updates in `game-state.ts` (`submitGuess`,
  `updateSettings`) and `leaderboard.ts` (`addScore` copies before sorting).
- **DRY** — `createDigitValidator` is reused by `isValidGuess` and `renderGame`'s `sanitize`;
  `renderHistory` and `renderLeaderboard` (`src/ui/components.ts`) are shared by the game and result
  screens; the `el` helper (`src/ui/dom.ts`) replaces repeated `createElement` code.
- **Meaningful names and no magic numbers** — `MIN_LENGTH`, `MAX_LENGTH`, `LENGTH_OPTIONS`
  (`game-state.ts`), `LEADERBOARD_SIZE` (`leaderboard.ts`), `BASES` (`digits.ts`),
  `TIMER_INTERVAL_MS` (`src/ui/app.ts`).
- **Small functions and guard clauses** — `submitGuess` returns early for `not-playing`, `invalid`
  and `duplicate`; `generateSecret` fails fast with `RangeError`; helpers like `pickIndex`,
  `removeAt`, `hasUniqueItems`, `fitLength` keep each function short.
- **Separation of concerns** — the UI never computes game rules; it calls core functions and renders
  the returned state (`src/ui/app.ts` → `mountApp`).
- **Errors as values** — `submitGuess` returns `{ state, error }` instead of throwing, so the UI can
  show a message without try/catch (`src/ui/screens/game.ts`).
