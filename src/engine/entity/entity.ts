import { Captured } from "../controller/base";
import { Decorate, Decorator, injectable, Mark } from "../decorators";
import { Entities } from "./entities";

export const EntitiesSymbol = Symbol('Entities');
export function entities(entity: Entity) {
    return entity[EntitiesSymbol];
}

@Decorate({
    expose: true,
    // @ts-expect-error FIXME somehow get rid of using callback ?
    parent: injectable(() => [Entity], true),
    [EntitiesSymbol]: injectable(Entities)
})
export default abstract class Entity extends Decorator(EventTarget) {
    // @Injectable(Entities, { optional: false })
	declare [EntitiesSymbol]: Entities;
    declare private _parent?: Entity;
    children: Mark<Entity[]>;

    set parent(parent: Entity | undefined) {
        if (this._parent) {
            const index = this._parent.children.findIndex(entity => entity === this);
            this._parent.children.splice(index, 1);
        }
        this._parent = parent;
        this._parent?.children.push(this);        
    }

    get parent() {
        return this._parent;
    }

    constructor() {
        super();

        this.children = [];
        entities(this).add(this);

        if (!this.parent) {
            entities(this).root.set(this, true);
            return;
        }
    }

    public destroy() {
        entities(this).remove(this);

        for (const child of this.children) {
            child.destroy();
        }
    }

    public update(delta: number, captured: Captured): void {}
}
