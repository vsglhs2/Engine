import Entity, { IRootEntity } from "./entity";

export const RootSymbol = Symbol('Root Symbol');
export function root(entity: Entity) {
    return entity[RootSymbol];
}

export class RootEntity implements IRootEntity {
    public parent = undefined;
    public children: Entity[] = [];

    add(entity: Entity) {
        this.children.push(entity);
    }

    remove(entity: Entity) {
        const index = this.children.findIndex(e => entity === e);
        this.children.splice(index, 1);
    }

    destroy() {
        this.children.length = 0;
    }
}
