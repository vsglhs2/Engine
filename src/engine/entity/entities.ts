import Entity from "./entity";

export class Entities {
    public readonly entities = new Map<Entity, true>();
    public readonly root = new Map<Entity, true>();

    add(entity: Entity) {
        this.entities.set(entity, true);
    }

    remove(entity: Entity) {
        this.entities.delete(entity);
    }

    clear() {
        this.entities.clear();
        this.root.clear();
    }

    public destroy() {
        const entities = Array.from(this.entities.keys());
        entities.forEach(entity => entity.destroy());
    }
}

const entities = new Entities();
export default entities;