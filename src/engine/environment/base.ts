import Renderer from "../render/renderer/base";

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
}