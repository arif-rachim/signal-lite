# Signal Library

## Introduction
The Signal Library is a lightweight utility library for managing signals and callbacks in JavaScript. Signals are a powerful tool for handling asynchronous events and managing state changes in reactive programming. This library provides a simple and flexible way to create and manage signals and their associated callbacks.

## Motivation
Asynchronous programming and reactive programming paradigms are becoming increasingly popular in modern web development. Managing signals and callbacks effectively is crucial for building responsive and maintainable applications. This library aims to simplify the process of handling signals and callbacks, making it easier to create reactive and event-driven applications.

## How it Works Behind the Scenes
The Signal Library provides two main constructs: signals and effects.

### Signals
A signal represents a value that can change over time. Signals can be either static values or computed values derived from other signals. Signals can have associated callbacks that are triggered when the signal's value changes.

### Effects
An effect is a callback function that is triggered when a signal becomes "dirty," meaning its value has changed since the last time it was accessed or mutated. Effects are useful for performing side effects or updating the application state in response to signal changes.

## Example Usage
```javascript
import { signal, effect } from 'signal-library';

// Create a signal with an initial value
const count = signal(0);

// Create an effect that logs the current value of the count signal
const logCount = effect(() => {
    console.log('Count:', count());
});

// Update the value of the count signal
count(1); // This will trigger the effect and log "Count: 1"
count(2); // This will trigger the effect and log "Count: 2"
```

In this example, we create a signal called `count` with an initial value of 0. We then create an effect called `logCount` that logs the current value of the `count` signal whenever it changes. Finally, we update the value of the `count` signal, which triggers the effect and logs the new value.

## License
This library is provided under the [MIT License](LICENSE).
