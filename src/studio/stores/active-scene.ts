import { Entities } from "@/engine/entity/entities";
import { RootEntity } from "@/engine/entity/root";
import { Realm } from "@/engine/realm";
import { Scene } from "@/engine/scene/scene";
import { action, isObservableObject, makeAutoObservable, makeObservable, observable } from "mobx";

class ActiveRealmStore extends Realm {
    constructor () {
        super();

        this.Root = makeAutoObservable(new RootEntity());
        this.Entities = makeAutoObservable(new Entities());

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

export class ActiveSceneStore {
    public scene?: Scene;
    public realm: ActiveRealmStore;

    constructor () {
        this.realm = new ActiveRealmStore();

        makeObservable(this, {
            scene: observable,
            realm: observable,
            activate: action,
        });
    }

    activate(scene: Scene) {
        this.scene?.destroy();
        this.scene = undefined;       

        // Make async later
        // await scene.load();
        scene.load(this.realm);
        this.scene = isObservableObject(scene) ? scene : makeAutoObservable(scene);
    }
}

export const activeScene = new ActiveSceneStore();