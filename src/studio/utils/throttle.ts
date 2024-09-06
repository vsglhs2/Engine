type Callback = (...args: any[]) => any;

export function throttle<C extends Callback>(callback: C, delay = 0) {
    let timer: ReturnType<typeof setTimeout>;
    let previousArgs: Parameters<C> | undefined;

    function wrapper(...args: Parameters<C>) {
        previousArgs = args;
        if (timer) return;

        if (previousArgs) {
            callback.apply(undefined, previousArgs);
            previousArgs = undefined;
        }

        timer = setTimeout(() => timer = 0, delay);
    }

    return wrapper;
}