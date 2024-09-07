import invariant from "tiny-invariant";
import { IRealmed, RealmSymbol } from "../realm";
import Entity, { IRootEntity } from "./entity";

export const RootSymbol = Symbol('Root Symbol');
export function root(entity: IRealmed) {
    return entity[RealmSymbol]['Root'];
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


    after(entity: Entity, after: Entity) {
        const index = this.children.findIndex(e => e === after);
        invariant(index !== -1, `There is no ${after} entity among the children`);

        this.children.splice(index, 0, entity);
    }

    before(entity: Entity, before: Entity) {
        const index = this.children.findIndex(e => e === before);
        invariant(index !== -1, `There is no ${before} entity among the children`);

        this.children.splice(index - 1, 0, entity);
    }
}
