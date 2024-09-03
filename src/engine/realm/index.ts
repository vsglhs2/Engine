
import InjectContext, { InjectStack } from "../decorators/inject-context";
import Serializer from "../decorators/serializer";
import { Entities } from "../entity/entities";
import { RootEntity } from "../entity/root";

export class Realms {
    private static stack: Realm[] = [];
    
    public static push(realm: Realm) {
        this.stack.unshift(realm);
    }

    public static active(): Realm {
        const realm = this.stack[0];
        if (!realm) throw new Error('There must be realm to operate');

        return realm;
    }

    public static pop() {
        this.stack.unshift();
    }
}

export class Realm {
    public InjectContext: InjectContext;
    public InjectStack: InjectStack;
    public Entities: Entities;
    public Root: RootEntity;
    // TODO: решить, нужен ли local Serializer, или достаточно global
    public Serializer: Serializer;

    constructor() {
        this.InjectContext = new InjectContext();
        this.InjectStack = new InjectStack();
        this.Entities = new Entities();
        this.Root = new RootEntity();
        this.Serializer = new Serializer();
    }

    destroy() {
        this.InjectContext.clear();
        this.InjectStack.clear();
        this.Serializer.clear();
        this.Entities.destroy();
        this.Root.destroy();
    }
}

// TODO: убрать
declare global {
    var Realms: Realms;
}
window.Realms = Realms;

// Содержит в себе инстансы глобальных классов по типу Entities
// из него экспортируются instance и inject decorators