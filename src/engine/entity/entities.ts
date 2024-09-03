import Entity from "./entity";

export class Entities {
    public entities = new Map<Entity, true>();

    add(entity: Entity) {
        this.entities.set(entity, true);
    }

    remove(entity: Entity) {
        this.entities.delete(entity);
    }

    destroy() {
        const entities = this.entities.keys();
        for (const entity of entities) {
            entity.destroy();
        }

        this.entities.clear();
    }
}