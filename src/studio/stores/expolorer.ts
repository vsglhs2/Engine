import { action, makeObservable, observable } from "mobx";
import { globalSerializer, SerializerStore } from "./serializer";
import Entity from "@/engine/entity/entity";
import { computedFn } from "mobx-utils";

export class ExplorerStore {
    declare getEntityIndex: (entity: Entity) => number;

    public serializer: SerializerStore;
    public state: Entity[] = [];

    constructor (serializer: SerializerStore) {
        this.serializer = serializer;

        makeObservable(this, {
            state: observable,
            putEntity: action,
            pushEntity: action,
            removeEntity: action,
        });

        this.getEntityIndex = computedFn((entity: Entity) => {
            return this.state.findIndex(e => e === entity);
        });
    }

    pushEntity(entity: Entity) {
        const index = this.getEntityIndex(entity);
        if (index !== -1)
            throw new Error(`Entity [${entity}] already in explorer`);

        this.state.push(entity);
    }

    putEntity(entity: Entity, atIndex = 0) {
        this.state.splice(atIndex, 1, entity);
    }

    removeEntity(entity: Entity) {
        const index = this.getEntityIndex(entity);
        if (index === -1) 
            throw new Error(`There is no entity [${entity}] in explorer`);

        this.state.splice(index, 1);
    }

    destroy() {
        this.state.length = 0;
    }
}

export const explorer = new ExplorerStore(globalSerializer);