import { DecoratorConstructor } from "@/engine/decorators";
import Serializer, { SerializableState } from "@/engine/decorators/serializer";
import Entity from "@/engine/entity/entity";
import { action, computed, makeObservable, observable } from "mobx";
import { computedFn } from "mobx-utils";

// TODO: move some of functionality to Serializer

export class SerializerStore extends Serializer {
    declare getEntityName: (entity: Entity) => string;
    declare getSerializableState: (key: string | DecoratorConstructor) => SerializableState;
    declare getExposedConstructor: (key: string) => DecoratorConstructor;

    private serializer: Serializer;

    constructor (serializer: Serializer) {
        super();

        this.serializer = serializer;
        Object.assign(this, this.serializer);
        makeObservable(this, {
            namedMap: observable.shallow,
            exposedMap: observable.shallow,
            serializableMap: observable.shallow,
            exposedKeys: computed,
            addExposed: action,
            addName: action,
            addSerializable: action,
            clear: action,
            sync: action,
            setEntityName: action,
        });

        this.getEntityName = computedFn((entity: Entity) => {
            return this.namedMap.get(entity) ?? entity.constructor.name;
        });

        this.getSerializableState = computedFn((key: string | DecoratorConstructor) => {
            const Constructor = typeof key === 'string' ? this.exposedMap.get(key) : key;
            if (!Constructor)
                throw new Error(`[${key}] is not exposed`);
    
            const state = this.serializableMap.get(Constructor);
            if (!state)
                throw new Error(`There is no serialize state for [${Constructor}]`);
    
            return state;
        });
    
        this.getExposedConstructor = computedFn((key: string) => {
            const Constructor = this.exposedMap.get(key);
            if (!Constructor)
                throw new Error(`[${key}] in not exposed`);
    
            return Constructor;
        });
    }

    setEntityName = (entity: Entity, name: string) => {
        this.namedMap.set(entity, name);
    };

    sync() {
        this.exposedMap.clear();
        for (const entry of this.serializer.exposedMap) {
            this.exposedMap.set(...entry);
        }

        this.serializableMap.clear();
        for (const entry of this.serializer.serializableMap) {
            this.serializableMap.set(...entry);
        }

        this.namedMap.clear();
        for (const entry of this.serializer.namedMap) {
            this.namedMap.set(...entry);
        }

    }

    get exposedKeys() {
        return Array.from(this.exposedMap.keys());
    }
}

export const globalSerializer = new SerializerStore(Serializer.global);