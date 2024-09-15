import { Entities } from "@/engine/entity/entities";
import Entity from "@/engine/entity/entity";
import { makeCounter } from "@/studio/utils";
import { action, makeObservable, observable } from "mobx";

const makeId = (() => {
    const id = makeCounter(0);
    
    return () => id().toString();
});

export class EntitiesStore extends Entities {
    public mapper: Map<Entity, string>;
    public backwardMapper: Map<string, Entity>;
    // TODO: подумать, куда лучше вынести
    public serializables: Set<Entity>;
    public id: () => string;

    constructor () {
        super();
        this.mapper = new Map();
        this.backwardMapper = new Map();
        this.serializables = new Set();
        this.id = makeId();

        makeObservable(this, {
            add: action,
            destroy: action,
            remove: action,
            entities: observable,
            mapper: false,
            backwardMapper: false,
            serializables: false,
            id: false,
        });
    }

    add(entity: Entity, id?: string): void {
        this.remove(entity);

        const entityId = id ?? this.id();
        this.backwardMapper.set(entityId, entity);
        this.mapper.set(entity, entityId);

        return super.add(entity);
    }

    remove(entity: Entity): void {
        const id = this.mapper.get(entity);

        if (id) this.backwardMapper.delete(id);
        this.mapper.delete(entity);

        return super.remove(entity);
    }

    destroy(): void {
        super.destroy();
        this.backwardMapper.clear();
        this.mapper.clear();
        this.serializables.clear();
        this.id = makeId();
    }
}
