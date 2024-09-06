import { AnyConstructor, DecoratorConstructor } from "@/engine/decorators";
import Serializer, { SerializableState } from "@/engine/decorators/serializer";
import { mapPrototypeChain } from "@/engine/decorators/utils/prototype";
import Entity from "@/engine/entity/entity";
import { action, computed, makeObservable, observable } from "mobx";
import { computedFn } from "mobx-utils";

// TODO: move some of functionality to Serializer

export class SerializerStore extends Serializer {
    declare getEntityName: (entity: Entity) => string;
    declare getSerializableState: (entity: Entity) => SerializableState | undefined;
    declare getExposedConstructor: (key: string) => DecoratorConstructor | undefined;

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

        this.getSerializableState = computedFn((entity: Entity) => {
            const Constructor = entity.constructor as DecoratorConstructor;

            return mapPrototypeChain(
                Constructor, (Constructor) => this.serializableMap.get(Constructor)
            ).reduceRight<Record<string, AnyConstructor>>((record, state) => {
                return Object.assign(record, state);
            }, {});
        });
    
        this.getExposedConstructor = computedFn((key: string) => {
            return this.exposedMap.get(key);
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