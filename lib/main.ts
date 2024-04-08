// Define a function type that takes no parameters and returns a value of type T
// This is useful for defining functions that are used as signals or callbacks
type NoParamFunction<T> = () => T;
// Define a type that can be either a value of type T or a function that returns a value of type T
// This allows us to use either a value or a function as a signal value
type SignalValue<T> = T | NoParamFunction<T>;

// Define an interface for a signal callback
// This interface defines the methods that a signal callback must implement
interface SignalCallback<T> {
    (): T; // A method that returns a value of type T
    (params: T): void; // A method that takes a parameter of type T and returns void
    destroy(): void; // A method that destroys the signal callback
}

// Define an interface for a signal callback setter that extends the SignalCallback interface
// This interface adds additional methods for managing the state of the signal callback
interface SignalCallbackSetter<T> extends SignalCallback<T> {
    isDirty(): boolean; // A method that checks if the signal callback is dirty
    setIsDirty(value: boolean): void; // A method that sets the dirty state of the signal callback
    referencedBy: SignalCallbackSetter<unknown>[]; // An array of signal callbacks that reference this signal callback
    onDirty: (callback: NoParamFunction<void>) => NoParamFunction<void>; // A method that adds a callback to be called when the signal callback becomes dirty
}

// Function to check if a value is a function
// This is used to determine if a signal value is a function or a value
function isValueAFunction<T>(value: unknown): value is NoParamFunction<T> {
    return value !== undefined && typeof value === 'function';
}

// Function to check if parameters are undefined
// This is used to determine if a signal callback is a setter or a getter
function areParamsUndefined(params: unknown) {
    return params === undefined;
}

// Define a context interface
// This interface defines the context in which the signals and callbacks operate
interface Context {
    activeSignal?: SignalCallback<unknown>; // The currently active signal callback
}

// Initialize the context
// This is the context that will be used by all signals and callbacks
const context: Context = {
    activeSignal: undefined,
};

// Function to mark a signal as dirty
// This function sets the dirty state of a signal callback and all signal callbacks that reference it
function markDirty<T>(signal?: SignalCallbackSetter<T>) {
    if (signal) {
        signal.setIsDirty(true);

        const referencedBy: SignalCallbackSetter<unknown>[] = signal.referencedBy || [];
        for (const referenceSignal of referencedBy) {
            markDirty(referenceSignal);
        }

    }
}

// Function to create a signal
// This function creates a signal callback with the given signal value
export function signal<T>(signalValue: SignalValue<T>): SignalCallback<T> {

    // Initialize the value of the signal. If the signal value is a function, initialize it as undefined.
    // Otherwise, use the provided signal value.
    let value: T | undefined = isValueAFunction(signalValue) ? undefined : signalValue;

    // Initialize the stale value and destroyed flags as false
    let isStaleValue = false;
    let isDestroyed = false;

    // Check if the signal value is a function
    const isComputeSignal = isValueAFunction(signalValue);

    // Initialize an array to hold the listeners of the signal
    const listeners: NoParamFunction<void>[] = [];

    // Define the function that will be triggered when the signal is accessed or mutated
    function onSignalTriggered(params?: T) {

        // Cast the function to a SignalCallbackSetter to access additional methods
        const self = onSignalTriggered as SignalCallbackSetter<T>;

        // Check if the function is being used as a setter (i.e., if parameters are provided)
        const isSetter = !areParamsUndefined(params);
        if (isSetter) {
            // If the signal is a computed signal, throw an error because its value cannot be set directly
            if (isComputeSignal) {
                throw new Error('A compute signal\'s value cannot be set directly. It is derived from other signals and should be updated by modifying those signals.');
            }
            // If the new value is different from the current value, update the value and mark the signal as dirty
            if (params !== value) {
                value = params;
                markDirty(self);
            }
            return;
        }

        // Save the currently active signal
        let signalCaller = context.activeSignal as SignalCallbackSetter<unknown>;

        // Set the active signal to the current signal
        context.activeSignal = self;

        // If the signal is a computed signal and it is dirty, recompute its value and mark it as not dirty
        if (isComputeSignal && self.isDirty()) {
            value = signalValue();
            self.setIsDirty(false);
        }

        // If there is a signal caller, add it to the list of signals that reference this signal
        if (signalCaller) {
            self.referencedBy = self.referencedBy ?? [];
            if (!self.referencedBy?.includes(signalCaller)) {
                self.referencedBy?.push(signalCaller);
            }
        }

        // Restore the previously active signal
        context.activeSignal = signalCaller;

        // Return the value of the signal
        return value;
    }

    // Define the methods of the signal callback setter
    function isDirty() {
        return isStaleValue;
    }

    function setIsDirty(value: boolean) {
        if (isDestroyed) {
            throw new Error('The signal has been destroyed and its value can no longer be set. Please check if the signal is valid before attempting to set its value.');
        }
        isStaleValue = value;
        if (isStaleValue) {
            for (const listener of listeners) {
                listener();
            }
        }
    }

    function onDirty(callback: NoParamFunction<void>) {
        if (isDestroyed) {
            throw new Error('The signal has been destroyed and listeners can no longer be added. Please check if the signal is valid before attempting to add a listener.');
        }
        listeners.push(callback);
        return function removeListener() {
            listeners.splice(listeners.indexOf(callback), 1);
        };
    }


    function destroy() {
        listeners.length = 0;
        isDestroyed = true;
    }

    // Cast the function to a SignalCallbackSetter and add the methods
    const self = onSignalTriggered as SignalCallbackSetter<T>;
    self.isDirty = isDirty;
    self.setIsDirty = setIsDirty;
    self.onDirty = onDirty;
    self.setIsDirty(isComputeSignal === true);
    self.destroy = destroy;

    // Return the signal callback setter
    return self;
}


// Function to create an effect
// This function creates a signal callback that triggers an effect when the signal becomes dirty
export function effect(callback: NoParamFunction<void>) {
    const signalCallback = signal(callback) as SignalCallbackSetter<unknown>;
    signalCallback();
    return signalCallback.onDirty(callback);
}
