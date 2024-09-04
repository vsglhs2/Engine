import Placeable, { MustGetRidOfThisPlaceableDefaults } from "@/engine/base/placeable/base";
import { Marked } from "@/engine/decorators";
import { Entities } from "@/engine/entity/entities";
import Entity from "@/engine/entity/entity";
import { root, RootEntity } from "@/engine/entity/root";
import { Realm } from "@/engine/realm";
import { makeAutoObservable, makeObservable, action, observable } from "mobx";

export class ActiveRealmStore extends Realm {
    constructor() {
        super();

        this.Root = makeObservable(new RootEntity(), {
            children: observable,
            parent: observable,
            add: action, 
            destroy: action,
            remove: action,
        });
        this.Entities = makeAutoObservable(new Entities());

        this.make = (
            Constructor,
            ...args
        ) => {
            const { InjectStack } = this;

            const toInjectArray = args.slice(Constructor.length);
            const toInject: Partial<Marked<typeof Constructor>> = toInjectArray[0] ?? {};

            type Key = keyof typeof toInject;

            let parent: Entity | undefined = undefined;
            if ('parent' in toInject) {
                parent = toInject['parent'] as Entity;
                delete toInject['parent'];
            }

            InjectStack.push();
            for (const key in toInject) {
                InjectStack.store(key, toInject[key as Key]);
            }

            const instance = new Constructor(...args);
            const observed = makeObservable(instance, {
                children: observable,
                add: action,
                remove: action,
                destroy: action,
            });

            InjectStack.pop();
            // @ts-ignore FIXME: fix type
            observed.parent = parent ?? this.Root;

            if (observed instanceof Placeable) {
                MustGetRidOfThisPlaceableDefaults(observed);
            }

            return observed as unknown as InstanceType<typeof Constructor>;
        }

        makeObservable(this, {
            destroy: action,
            Entities: observable,
            InjectContext: observable,
            InjectStack: observable,
            Root: observable,
            Serializer: observable,
        });
    }
}