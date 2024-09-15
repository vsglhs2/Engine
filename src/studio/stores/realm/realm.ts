import Placeable, { MustGetRidOfThisPlaceableDefaults } from "@/engine/base/placeable/base";
import { EntityDerived, Injectables, Marked } from "@/engine/decorators";
import Entity from "@/engine/entity/entity";
import { RootEntity } from "@/engine/entity/root";
import { Realm } from "@/engine/realm";
import { makeObservable, action, observable } from "mobx";
import { EntitiesStore } from "./entities";

export type MakeFunction = <
    Constructor extends EntityDerived,
    Args extends ConstructorParameters<Constructor>
>(
    Constructor: Constructor,
    ...args: [...Args, inject?: Injectables<Constructor> & { id?: string }]
) => InstanceType<Constructor>;

export class RealmStore extends Realm {
    declare Entities: EntitiesStore;
    declare make: MakeFunction & ThisType<RealmStore>;

    constructor() {
        super();

        this.Root = makeObservable(new RootEntity(), {
            children: observable,
            parent: observable,
            add: action, 
            destroy: action,
            before: action,
            after: action,
            remove: action,
        });
        this.Entities = new EntitiesStore();

        this.make = (
            Constructor,
            ...args
        ) => {
            const { InjectStack } = this;

            const toInjectArray = args.slice(Constructor.length);
            const toInject: Partial<Marked<typeof Constructor> > & { id?: string } =
                toInjectArray[0] ?? {};

            type Key = keyof typeof toInject;

            let parent: Entity | undefined = undefined;
            if ('parent' in toInject) {
                parent = toInject['parent'] as Entity;
                delete toInject['parent'];
            }

            InjectStack.push();
            for (const key in toInject) {
                if (key === 'id') continue;
                InjectStack.store(key, toInject[key as Key]);
            }

            const instance = new Constructor(...args);
            let observed = makeObservable(instance, {
                children: observable,
                add: action,
                remove: action,
                destroy: action,
                before: action,
                after: action,
            });

            InjectStack.pop();
            // @ts-ignore FIXME: fix type
            observed.parent = parent ?? this.Root;

            if (observed instanceof Placeable && !observed.size.height && !observed.size.width) {
                // @ts-ignore  FIXME
                observed.size = undefined;
                // @ts-ignore FIXME
                observed.position = undefined;
                MustGetRidOfThisPlaceableDefaults(observed);
            }

            // TODO: Подумать, как правильнее сделать проброс id
            if (toInject.id) {
                this.Entities.add(instance, toInject.id);
            }

            if (InjectStack.isEmpty()) {
                this.Entities.serializables.add(observed);
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