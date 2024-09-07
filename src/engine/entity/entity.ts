import invariant from "tiny-invariant";
import { Captured } from "../controller/base";
import { Callback, Decorate, Decorator, injectable, Mark } from "../decorators";
import { IRealmed, Realm, RealmSymbol } from "../realm";
import { MakeFunction } from "./make";
import { root } from "./root";

export const EntitiesSymbol = Symbol('Entities Symbol');
export function entities(entity: IRealmed) {
    return entity[RealmSymbol]['Entities'];
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
    [RealmSymbol]: injectable(Realm),
    make: injectable(Callback),
})
export default abstract class Entity extends Decorator(EventTarget) implements IEntity {
    declare [RealmSymbol]: Realm;
    declare make: MakeFunction;
    declare private _parent?: Entity;

    children: Mark<Entity[]>;

    // FIXME 
    add(entity: Entity) {
        this.children.push(entity);
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

    remove(entity: Entity) {
        const index = this.children.findIndex(e => entity === e);
        this.children.splice(index, 1);
    }

    set parent(parent: Entity | undefined) {
        if (this._parent) {
            this._parent.remove(this);
        }

        // THINK: maybe ensure that parent become RootEntity if passed undefined ?
        this._parent = parent;
        if (this._parent)
        this._parent.add(this);        
    }

    get parent() {
        return this._parent;
    }

    constructor() {
        super();

        this.children = [];
        entities(this).add(this);
    }

    public destroy() {
        entities(this).remove(this);

        for (const child of this.children) {
            child.destroy();
        }

        this.parent = undefined;
        this.children.length = 0;

        // THINK: add serializer clean up ?
    }

    public update(delta: number, captured: Captured): void {}

    static [Symbol.toStringTag]() {
        return this.name;
    }
}
