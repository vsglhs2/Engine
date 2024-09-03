import { AnyConstructor, DecoratorConstructor } from ".";

export default class Serializer {
    public static global = new Serializer();
    
    public exposed: Map<
        DecoratorConstructor,
        Record<string | symbol, AnyConstructor>
    > = new Map();
    public keys: Map<DecoratorConstructor, string> = new Map();

    addSerializable(Constructor: DecoratorConstructor, key: string | symbol, as: AnyConstructor) {
        let keys = this.exposed.get(Constructor);
        if (!keys) keys = this.exposed.set(Constructor, {}).get(Constructor)!;

        keys[key] = as;
    }

    addExposable(Constructor: DecoratorConstructor, as: string) {
        this.exposed.set(Constructor, {});
        this.keys.set(Constructor, as);
    }

    public clear() {
        this.exposed.clear();
        this.keys.clear();
    }
}

