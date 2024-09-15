import { Scene } from "@/engine/scene/scene";
import { makeAutoObservable } from "mobx";
import invariant from "tiny-invariant";

type SourceType = 'url' | 'file';
type Source = {
    type: 'url';
    url: string;
} | {
    type: 'file';
    file: File;
};

export class ImporterStore {
    public sceneSourceMapper: Map<Scene, Source>;

    async importUrlAsScene(url: string) {
        const module: unknown = await import(url);

        // show message instead
        invariant(
            module &&
            typeof module === 'object' &&
            'default' in module &&
            module.default instanceof Scene
        );

        const { default: scene } = module;
        this.sceneSourceMapper.set(scene, {
            type: 'url',
            url: url,
        })

        return scene;
    }

    constructor () {
        this.sceneSourceMapper = new Map();

        makeAutoObservable(this);
    }

}

export const importer = new ImporterStore();