import { Scene } from "@/engine/scene/scene";
import { action, isObservableObject, makeAutoObservable, makeObservable, observable } from "mobx";
import { ActiveRealmStore } from "./realm";

// THINK: convert it to SceneStore like RealmStore?

export class SceneStore {
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

export const scene = new SceneStore();