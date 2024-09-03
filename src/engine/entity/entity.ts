import { Captured } from "../controller/base";
import { Decorate, Decorator, injectable, Mark } from "../decorators";
import { Entities } from "./entities";
import { root, RootEntity, RootSymbol } from "./root";

export const EntitiesSymbol = Symbol('Entities Symbol');
export function entities(entity: Entity) {
    return entity[EntitiesSymbol];
}

export interface IEntity {
    parent: IEntity | undefined;
    children: IEntity[];
}

export interface IRootEntity extends IEntity {
    parent: undefined;
    children: Entity[];
}

@Decorate({
    expose: true,
    // @ts-expect-error FIXME somehow get rid of using callback ?
    parent: injectable(() => [Entity], true),
    [EntitiesSymbol]: injectable(Entities),
    [RootSymbol]: injectable(RootEntity),
})
export default abstract class Entity extends Decorator(EventTarget) implements IEntity {
    // @Injectable(Entities, { optional: false })
	declare [EntitiesSymbol]: Entities;
    declare [RootSymbol]: RootEntity;
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
            root(this).add(this);

            // TODO: reconsider
            // this.parent = root as Entity;
            return;
        }
    }

    public destroy() {
        entities(this).remove(this);

        for (const child of this.children) {
            child.destroy();
        }

        this._parent = undefined;
        this.children.length = 0;
    }

    public update(delta: number, captured: Captured): void {}

    static [Symbol.toStringTag]() {
        return this.name;
    }
}
