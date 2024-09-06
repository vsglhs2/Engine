import { AnyConstructor, DecoratorConstructor } from ".";
import Entity from "../entity/entity";

export type SerializableState = Record<string | symbol, AnyConstructor>;

// TODO: make more handy api

export default class Serializer {
    public static global = new Serializer();
    
    public serializableMap: Map<
        DecoratorConstructor,
        SerializableState
    > = new Map();
    public exposedMap: Map<string, DecoratorConstructor> = new Map();
    // TODO: need to be weak map, but otherwise cant figure out how to sync with mobx
    public namedMap: Map<Entity, string> = new Map();

    addSerializable(Constructor: DecoratorConstructor, key: string | symbol, as: AnyConstructor) {
        let keys = this.serializableMap.get(Constructor);
        if (!keys) keys = this.serializableMap.set(Constructor, {}).get(Constructor)!;

        keys[key] = as;
    }

    addExposed(Constructor: DecoratorConstructor, as: string) {
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

