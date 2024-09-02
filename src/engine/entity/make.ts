import { EntityDerived, Injectables } from "../decorators";
import { Realms } from "../realm";

// Сделать one-time buffer, в который будет пушится объект для
// инъекции. Благодаря этому в конструкторе можно будет вызывать
// instance метод

// Нужно сделать pushDefault, pushOneTime для назначения
// дефолтов для инъекций

export default function make<
    Constructor extends EntityDerived,
    Args extends ConstructorParameters<Constructor>
>(
    Constructor: Constructor,
    ...args: [...Args, inject?: Injectables<Constructor>]
) {
    const { InjectStack } = Realms.active();
    const [toInject] = args.slice(Constructor.length) ?? {};
    type Key = keyof typeof toInject;

    InjectStack.push();
    for (const key in toInject) {
        InjectStack.store(key, toInject[key as Key]);
    }

    const instance = new Constructor(...args);

    InjectStack.pop();

    return instance as unknown as InstanceType<Constructor>;
}

