
# Signal Lite

This library provides a way for things to talk to each other in a program. Imagine you have toys, and they need to tell each other something cool. That's what this library helps with!

## What it Does

This library has two main parts: signals and callbacks.

### Signals

Think of a signal like a message. It's something one part of the program sends to another part. But, instead of words or pictures, it can be anything—like a number or a color.

### Callbacks

A callback is like a listener. It waits for a signal and does something when it gets one. It's like when your friend says, "Ready, set, go!" and you start running. You're the callback, and "Ready, set, go!" is the signal.

## How to Use

To use this library, you can create signals and callbacks.

### Creating Signals

You can create a signal using the `signal` function. Just decide what the signal should carry—like a number, a color, or anything else.

Example:

```typescript
// Create a signal with a number
const mySignal = signal(42);

// Create a signal with a function
const myComputedSignal = signal(() => {
    return 2 * mySignal();
});
```

### Creating Callbacks

You can create a callback using the `effect` function. This function takes another function as an argument. When the signal changes, the function you provided will run.

Example:

```typescript
// Create a callback that logs a message when mySignal changes
const clearEffect = effect(() => {
    console.log('mySignal changed!'+ myComputedSignal());
});
```

### Changing Signal Values

You can change the value of a signal using the signal itself. But, remember, some signals are like puzzles—they figure out their value based on other signals. You can't change those directly!

Example:

```typescript
// Change the value of mySignal
mySignal(100);
```

### Destroying Signals and Callbacks

When you're done with a signal or callback, you can destroy it to free up space and stop it from working.

Example:

```typescript
// destroy signal
mySignal.destroy()
// unwatch effect
clearEffect();
```

That's it! Now your program can talk to itself using signals and callbacks.

## Example
Let's consider a more complex scenario involving a real-time collaborative document editing application. In this application, multiple users can simultaneously edit a document, and changes made by one user should be reflected in real-time to all other users.

```typescript
// Create a signal for the document content
const documentContentSignal = signal("");

// Function to handle document editing by a user
function editDocument(newContent) {
    documentContentSignal(newContent); // Update the document content signal
}

// Create an effect to update the UI with the latest document content
effect(() => {
    const documentContent = documentContentSignal();
    updateDocumentUI(documentContent); // Update the UI with the latest document content
});

// Simulate real-time collaboration by updating the document content
// This could be triggered by WebSocket events or other real-time communication mechanisms
setInterval(() => {
    const randomEdit = generateRandomEdit(); // Generate a random edit
    editDocument(applyEdit(randomEdit)); // Apply the edit to the document
}, 2000); // Simulate updates every 2 seconds

// Function to apply an edit to the document content
function applyEdit(edit) {
    // Apply the edit to the document content and return the updated content
    // This could involve operations like inserting, deleting, or replacing text
    // For simplicity, we'll just append the edit to the document content
    return documentContentSignal() + edit;
}

// Function to generate a random edit for simulation purposes
function generateRandomEdit() {
    // Generate a random string representing a simulated edit
    return Math.random().toString(36).substring(2, 15);
}
```

In this scenario, the `documentContentSignal` represents the content of the document. When a user edits the document, the `editDocument` function is called to update the document content signal. The effect then automatically updates the UI with the latest document content.

To simulate real-time collaboration, we generate random edits to the document content at regular intervals. These edits are applied using the `applyEdit` function, which updates the document content signal. The effect then ensures that the UI reflects these changes in real-time.

This example demonstrates how signals and effects can be used to implement real-time collaborative features in a document editing application with relatively concise code.