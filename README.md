# Signal-Lite

Signal-Lite is a small TypeScript library for reactive state based on signals, written as a dependency-free alternative to larger state libraries when all you need is values that notify their dependents. A signal is a single function: call it with no argument to read its value, or with an argument to set it. If you create a signal from a function instead of a value, it becomes a computed signal that records which other signals it reads and recalculates lazily, only after one of them changes. An `effect` runs a callback once, then runs it again every time a signal it depends on changes, and returns a function that stops it. The whole implementation is one file of under 200 lines (`lib/main.ts`), built with Vite in library mode into ES module and UMD bundles and published to npm as `signal-lite`. It is an early release (version `0.0.1-rc1`, April 2024) with no tests yet.

> Status: early release candidate. Not actively maintained.

## Features

- `signal(value)` for writable state and `signal(() => ...)` for computed values
- Automatic dependency tracking: a computed signal or effect registers itself with every signal it reads
- Lazy recomputation: computed signals are marked dirty when a dependency changes and recalculate on the next read
- Setting a signal to the same value (`===`) does not notify dependents
- `effect(callback)` returns an unsubscribe function
- `destroy()` on a signal removes its listeners
- No runtime dependencies

## Tech stack

TypeScript · Vite 5 (library mode, ES + UMD output)

## Installation

```bash
npm install signal-lite
```

## Usage

```typescript
import { signal, effect } from 'signal-lite';

// A writable signal with an initial value
const count = signal(0);

// A computed signal, recalculated only when `count` has changed
const isEven = signal(() => (count() & 1) === 0);

// An effect runs immediately, then again whenever a signal it reads changes
const unWatch = effect(() => {
    console.log('Count:', count());
});
// logs "Count: 0"

count(1); // logs "Count: 1"
count(2); // logs "Count: 2"
count(2); // same value: nothing is logged

effect(() => console.log('Even:', isEven())); // logs "Even: true"
count(3); // logs "Count: 3" and "Even: false"

unWatch(); // stop the effect
```

The demo page in this repository (`index.html` + `src/main.ts`) uses a signal updated every second, a computed signal that formats it, and an effect that writes it into the page.

## How it works

The library provides two constructs: signals and effects.

### Signals

A signal represents a value that can change over time. It is either a plain value or a computed value derived from other signals.

- While a signal is being read, it is stored as the "active" signal in a shared context. Any signal it reads during that time adds the active signal to its `referencedBy` list. This is how dependencies are discovered.
- When a writable signal is set to a new value, it marks itself dirty and walks its `referencedBy` list, marking every dependent signal dirty as well.
- A computed signal starts dirty. When it is read while dirty, it runs its function, stores the result and becomes clean again. Trying to set a computed signal throws an error.

### Effects

An effect is a computed signal whose function is the callback. `effect()` reads it once so that its dependencies are recorded, then subscribes to its "dirty" notification and calls the callback each time it fires. The return value removes that subscription.

## API

| Function | Description |
|---|---|
| `signal<T>(value: T \| (() => T))` | Creates a signal. Returns a function `s()` to read and `s(newValue)` to write, plus `s.destroy()`. |
| `effect(callback: () => void)` | Runs `callback` now and after every change to a signal it read. Returns a function that stops it. |

## Development

```bash
npm install
npm run dev      # Vite dev server for the demo page
npm run build    # type-check, then build dist/signal-lite.js and dist/signal-lite.umd.cjs
```

## Limitations

- `index.d.ts`, which `package.json` lists as the type declarations, is still the Vite template file and does not describe `signal` or `effect`, so TypeScript users of the npm package get no correct types.
- Calling `s(undefined)` is treated as a read, so a signal cannot be set to `undefined`.
- Updates are synchronous and not batched: every set immediately runs the affected effects. An effect that reads both a signal and a computed signal derived from it runs more than once per change, and the first run can see the computed signal's old value.
- Dependencies are recorded on reads and never removed, so a computed signal or effect keeps reacting to signals it read in earlier runs.
- There are no tests.

## License

This library is provided under the [MIT License](LICENSE).
