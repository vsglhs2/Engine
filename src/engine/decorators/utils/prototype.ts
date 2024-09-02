import { AnyConstructor } from "..";

export function isInPrototypeChain(
    toSearchIn: InstanceType<AnyConstructor>,
    target: AnyConstructor
) {
    const matched = target === toSearchIn;
    if (matched) return true;

    const nextToSearchIn = Object.getPrototypeOf(toSearchIn);
    if (!nextToSearchIn) return false;

    return isInPrototypeChain(nextToSearchIn, target);
}

export function mapPrototypeChain<
    Target extends AnyConstructor,
    Map extends (target: Target) => any
>(target: Target, map: Map): ReturnType<Map>[] {
    const prototype = Object.getPrototypeOf(target);
    if (!prototype) return [map(target)];

    return [map(target), ...mapPrototypeChain(prototype, map)];
}

export function walkPrototypeChain<
    Target extends AnyConstructor,
    Condition extends (target: Target) => any
>(target: Target, condition: Condition): AnyConstructor | undefined {
    const prototype = Object.getPrototypeOf(target);
    const Result = Boolean(condition(target)) ? target : undefined;
    if (!prototype) return Result;

    return Result ?? walkPrototypeChain(prototype, condition);
}