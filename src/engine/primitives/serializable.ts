import { Constructor } from "../decorators";

type SerializableEntry<C extends Constructor = Constructor> = {
    Constructor: C;
    serialize: (this: InstanceType<C>) => unknown[];
    deserialize: (...args: unknown[]) => InstanceType<C>;
};

export class SceneSerializer {
    private map: Map<string, SerializableEntry> = new Map();

    registerSerializable<C extends Constructor>(
        Constructor: C,
        serialize: SerializableEntry<C>['serialize'],
        deserialize?: SerializableEntry<C>['deserialize']
        
    ) {
        this.map.set(Constructor.name, {
            Constructor,
            serialize,
            deserialize: deserialize ?? ((...args) => (new Constructor(...args)))
        });
    }

    canBeSerialized(value: object) {
        return this.map.has(value.constructor.name);
    }

    makeFromSerialized(constructor: string, args: unknown[]) {
        const entry = this.map.get(constructor);
        if (!entry) {
            // TODO: заменить на message
            console.error(`Error during deserializing [${constructor}]`);
            return;
        }

        const { deserialize } = entry;
        return deserialize(...args);
    }

    prepareToSerialize(value: object) {
        const entry = this.map.get(value.constructor.name);
        const name = value.constructor.name;
        if (!entry) {
            // TODO: заменить на message
            console.error(`Error during deserializing [${name}]`);
            return;
        }
        const serialized = entry.serialize.call(value);

        return [name, serialized] as const;
    }
}

export const sceneSerializer = new SceneSerializer();