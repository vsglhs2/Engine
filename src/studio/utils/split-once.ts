export function splitOnce(string: string, separator: string) {
    const [head, ...tail] = string.split(separator);

    return [head, tail.join(separator)];
}