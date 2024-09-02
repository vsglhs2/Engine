import { Scene } from "./scene";

export default class SceneManager {
    private map: Map<string, Scene>;
    private current?: Scene;

    constructor (initial: [string, Scene][] = []) {
        this.map = new Map(initial);
    }

    get active(): Scene | undefined {
        return this.current;
    }

    set active(name: string) {
        const scene = this.map.get(name);
        this.current = scene;
    }

    add(name: string, scene: Scene) {
        this.map.set(name, scene);
    }

    delete(name: string) {
        this.map.delete(name);
    }

    rename(oldName: string, newName: string) {
        const scene = this.map.get(oldName);
        if (!scene) throw new Error(`There is no scene with name [${oldName}]`);

        this.map.set(newName, scene);
    }

    scene(name: string) {
        return this.map.get(name);
    }    

    scenes(names: string[] | IterableIterator<string> = this.map.keys()) {
        const scenes: Scene[] = [];

        for (const name of names) {
            const scene = this.map.get(name);
            if (scene) scenes.push(scene);
        }

        return scenes;
    }
}