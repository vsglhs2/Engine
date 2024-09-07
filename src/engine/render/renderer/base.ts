import Renderable from "../renderable/base";
import { RendererContext } from "./utils";

export default abstract class Renderer<Context extends RendererContext = RendererContext> {
    protected renderables = new Map<Renderable<Renderer<Context>>, true>();

    constructor(protected context: Context) {}

    public prepare(): void {}
    public render(): void {
        for (const renderable of this.renderables.keys()) {
            renderable.render();
        }
    }

    public getContext() {
        return this.context;
    }
    public addRenderable(renderable: Renderable<Renderer<Context>>): void {
        this.renderables.set(renderable, true);
    }
    public removeRenderable(renderable: Renderable<Renderer<Context>>): void {
        this.renderables.delete(renderable);
    }
    public clearRenderables(): void {
        this.renderables.clear();
    }

    public destroy() {
        this.clearRenderables();
    }
}