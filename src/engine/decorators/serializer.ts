import { AnyConstructor, DecoratorConstructor } from ".";
import Entity from "../entity/entity";

export default class Serializer {
    public static global = new Serializer();
    
    public serializableMap: Map<
        DecoratorConstructor,
        Record<string | symbol, AnyConstructor>
    > = new Map();
    public exposedMap: Map<string, DecoratorConstructor> = new Map();
    public namedMap: WeakMap<Entity, string> = new WeakMap();

    addSerializable(Constructor: DecoratorConstructor, key: string | symbol, as: AnyConstructor) {
        let keys = this.serializableMap.get(Constructor);
        if (!keys) keys = this.serializableMap.set(Constructor, {}).get(Constructor)!;

        keys[key] = as;
    }

    addExposable(Constructor: DecoratorConstructor, as: string) {
        this.serializableMap.set(Constructor, {});
        this.exposedMap.set(as, Constructor);
    }

    addName(entity: Entity, name: string) {
        this.namedMap.set(entity, name);
    }

    public clear() {
        this.serializableMap.clear();
        this.exposedMap.clear();
    }
}

