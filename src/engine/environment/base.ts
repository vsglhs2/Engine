import Renderer from "../render/renderer/base";

export type SerializedEnvironment = {
    key: string;
    shifts: unknown[];
};

export abstract class Environment {
    public renderers: Renderer[];

    constructor (renderers: Renderer[]) {
        this.renderers = renderers;
    }

    destroy() {
        for (const renderer of this.renderers) {
            renderer.destroy();
        }
    }

    abstract serialize(): Promise<SerializedEnvironment>;
}