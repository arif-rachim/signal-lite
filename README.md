# Signal-Lite

## Introduction
Signal-Lite is a handy tool that helps manage signals and callbacks. Signals can be values or computed values, and they can initiate callbacks when they change. Callbacks are set up to react to these changes, making for a lively and interactive setting. 

### Motivation
Being a lightweight tool, Signal-Lite doesn't put much strain on your system, which can lead to quicker operations and better use of memory. This can be especially useful in situations where speed is key. Even though it's simple, Signal-Lite offers an effective method to oversee state and manage changes, aiding in the development of neat and easy-to-maintain code.

### What Are Signals?

Signals are like traffic signs for data in our programs. They guide how information moves, ensuring it flows smoothly and efficiently. Think of them as pointers that help track changes and dependencies in our data.

### How Do They Work?

Let's break it down with a simple example. Say we have a counter in our program, and we want to know if it's an even number or not. With signals, we can easily set this up:

```typescript
const counter = signal(0); // Initialize the counter
const isEven = signal(() => (counter.get() & 1) == 0); // Determine if the counter is even
```
Now, whenever we change the counter, the signal automatically updates to reflect whether it's even or not.

### The Power of Signals
But what makes signals so powerful? It's their ability to track changes and optimize computations. When a piece of data changes, signals know exactly what other parts of the program might be affected. This means we can avoid unnecessary recalculations and keep our programs running smoothly.

## How it Works Behind the Scenes
The Signal-Lite provides two main constructs: signals and effects.

### Signals
A signal represents a value that can change over time. Signals can be either static values or computed values derived from other signals. Signals can have associated callbacks that are triggered when the signal's value changes.

### Effects
An effect is a callback function that is triggered when a signal becomes "dirty," meaning its value has changed since the last time it was accessed or mutated. Effects are useful for performing side effects or updating the application state in response to signal changes.

## Example Usage
```typescript
import { signal, effect } from 'signal-lite';

// Create a signal with an initial value
const count = signal(0);

// Create an effect that logs the current value of the count signal
const unWatch = effect(() => {
    console.log('Count:', count());
});

// Update the value of the count signal
count(1); // This will trigger the effect and log "Count: 1"
count(2); // This will trigger the effect and log "Count: 2"
```

In this example, we create a signal called `count` with an initial value of 0. We then create an effect that watch the current value of the `count` signal whenever it changes. Finally, we update the value of the `count` signal, which triggers the effect and logs the new value.

## License
This library is provided under the [MIT License](LICENSE).
