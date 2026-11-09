# Bulls and Cows

Client-side Bulls and Cows game written in TypeScript with a pure functional core.
RS School task: [bulls-and-cows](https://github.com/rolling-scopes-school/tasks/blob/master/fullstack-engineering/tasks/bulls-and-cows/README.md).

The computer picks a secret number of unique digits (length 2–6, base bin/oct/dec/hex).
After each guess you see **bulls** (right digit, right place) and **cows** (right digit, wrong place).

## Getting started

```bash
npm install          # also installs Husky git hooks
npm run build        # compile TypeScript to ./dist
npx serve .          # or open index.html with Live Server
```

## Scripts

| Script               | What it does                                       |
| -------------------- | -------------------------------------------------- |
| `npm run build`      | Compile `src/` to ES modules in `dist/` with `tsc` |
| `npm run dev`        | `tsc --watch`                                      |
| `npm run build:site` | Build and collect the static site into `public/`   |
| `npm test`           | Run Vitest once                                    |
| `npm run lint`       | ESLint                                             |
| `npm run format`     | Prettier (write)                                   |

## Git hooks

- **pre-commit** — `lint-staged` (ESLint + Prettier on staged files only)
- **pre-push** — `npm test`, a push is blocked when tests fail

## Project structure

```
src/core/   pure game logic (no DOM)
src/ui/     DOM rendering, events, localStorage
tests/      Vitest unit tests for the core
```

Design notes, complexity and clean-code principles: [DESIGN.md](./DESIGN.md).
