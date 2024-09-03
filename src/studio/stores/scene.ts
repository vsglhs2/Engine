import { makeAutoObservable } from "mobx";
import { Scene } from "../../engine/scene/scene";

export class SceneStore {
    public scene: Scene | undefined;
    constructor () {
        makeAutoObservable(this);
    }
}

export const scene = new SceneStore();