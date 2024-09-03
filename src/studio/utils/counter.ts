export function makeCounter(from: number) {
    return (add = 1) => from += add;
}