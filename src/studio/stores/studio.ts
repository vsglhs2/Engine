import { makeAutoObservable } from "mobx";
import { topbar } from "./top-bar";
import { scene } from "./scene";

export enum CanvasMode {
    EDITOR,
    PREVIEW_PLAY,
    PREVIEW_PAUSE,
};

export class StudioStore {
    public canvasMode: CanvasMode;

    constructor () {
        this.canvasMode = CanvasMode.EDITOR;

        makeAutoObservable(this);

        topbar.subscribe('preview', () => {
            console.log('preview');
            this.canvasMode = CanvasMode.PREVIEW_PLAY;

            scene.writeSerializedState('before-preview');
        });

        topbar.subscribe('stop', () => {
            console.log('stop');
            this.canvasMode = CanvasMode.EDITOR;

            scene.scene?.destroy();
            scene.scene?.load(scene.realm);
            scene.restoreFromSerializedState('before-preview');
        });
    }
}

export const studio = new StudioStore();