import { AbstractMarked, DecoratorConstructor } from ".";
import { walkPrototypeChain } from "./utils/prototype";

export class InjectStack {
    private stack: Record<string, unknown>[] = [];

    public push() {
        this.stack.unshift({});
    }

    public store(key: string, value: unknown, overwrite = true) {
        const buffer = this.read();

        if (!(key in buffer) || overwrite) buffer[key] = value;
    }

    public read() {
        const buffer = this.stack[0];
        if (!buffer) throw new Error('There is no buffer to store in');

        return buffer;
    }

    public pop() {
        this.stack.shift();
    }

    public clear() {
        this.stack.length = 0;
    }
}

export const DecoratorSymbol = Symbol('Decorator symbol');
type InjectContextKeys = typeof DecoratorSymbol;

export default class InjectContext {
    private map: Map<
        DecoratorConstructor, 
        Record<string, unknown | (() => unknown)>
    > = new Map();

    public set<
        Constructor extends DecoratorConstructor,
        Key extends keyof AbstractMarked<Constructor> | InjectContextKeys
    >(
        Constructor: Constructor,
        key: Key, 
        injectable: AbstractMarked<Constructor>[Key] | (() => AbstractMarked<Constructor>[Key])
    ) {
        let keys = this.map.get(Constructor);
        if (!keys) keys = this.map.set(Constructor, {}).get(Constructor)!;

        keys[<string>key] = injectable;
    }

    public get<
        Constructor extends DecoratorConstructor,
        Key extends keyof AbstractMarked<Constructor> | InjectContextKeys,
    >(Constructor: Constructor, key: Key) {
        const Target = walkPrototypeChain(
            Constructor, 
            constructor => {
                const record = this.map.get(constructor) ?? {};
                return <string>key in record;
            }
        );

        const record = Target ? this.map.get(Target as DecoratorConstructor)! : {};
        let value = record[<string>key];
        if (typeof value === 'function') value = value();

        return value as AbstractMarked<Constructor>[Key] | undefined;
    }

    public clear() {
        this.map.clear();
    }
}
