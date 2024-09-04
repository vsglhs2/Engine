import { EntityDerived, Injectables, Marked } from "../decorators";
import { Realm } from "../realm";
import { root } from "./root";

export default function make<
    Constructor extends EntityDerived,
    Args extends ConstructorParameters<Constructor>
>(
    this: Realm,
    Constructor: Constructor,
    ...args: [...Args, inject?: Injectables<Constructor>]
) {
    if (!(this instanceof Realm))
        throw new Error('Make function must be used in realm context');

    const { InjectStack } = this;
    const toInjectArray = args.slice(Constructor.length);
    const toInject: Partial<Marked<typeof Constructor>> = toInjectArray[0] ?? {};

    type Key = keyof typeof toInject;
    InjectStack.push();

    for (const key in toInject) {
        InjectStack.store(key, toInject[key as Key]);
    }

    const instance = new Constructor(...args);
    InjectStack.pop();

    // THINK: is it better to place on Entity or here ?
    if (!instance.parent) {
        // FIXME fix type
        instance.parent = root(instance);
    }

    return instance as unknown as InstanceType<Constructor>;
}

// TODO: Заменить на OmitThisType (Падает с cycle ref error)
export type MakeFunction = <
    Constructor extends EntityDerived,
    Args extends ConstructorParameters<Constructor>
>(
    Constructor: Constructor,
    ...args: [...Args, inject?: Injectables<Constructor>]
) => InstanceType<Constructor>;
export type BoundMakeFunction<R extends Realm> = (typeof make) & ThisType<R>;
