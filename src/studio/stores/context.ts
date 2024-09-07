import { action, makeObservable, observable } from "mobx";
import { globalSerializer, SerializerStore } from "./serializer";
import Entity from "@/engine/entity/entity";
import { computedFn } from "mobx-utils";

export class ContextStore {
    declare getEntityIndex: (entity: Entity) => number;

    // TODO: поделить Serializer на EntitySerializer и ConstructorSerializer
    public serializer: SerializerStore;
    public stack: Entity[] = [];

    constructor (serializer: SerializerStore) {
        this.serializer = serializer;

        makeObservable(this, {
            stack: observable,
            putEntity: action,
            pushEntity: action,
            popEntity: action,
            removeEntity: action,
        });

        this.getEntityIndex = computedFn((entity: Entity) => {
            return this.stack.findIndex(e => e === entity);
        });
    }

    pushEntity(entity: Entity) {
        const index = this.getEntityIndex(entity);
        if (index !== -1)
            throw new Error(`Entity [${entity}] already in context`);

        this.stack.push(entity);
    }

    popEntity() {
        if (!this.stack.length)
            throw new Error(`There is no entity to pop`);

        return this.stack.pop();
    }

    putEntity(entity: Entity, atIndex = 0) {
        this.stack.splice(atIndex, 1, entity);
    }

    removeEntity(entity: Entity) {
        const index = this.getEntityIndex(entity);
        if (index === -1) 
            throw new Error(`There is no entity [${entity}] in context`);

        this.stack.splice(index, 1);
    }

    destroy() {
        this.stack.length = 0;
    }
}

export const context = new ContextStore(globalSerializer);