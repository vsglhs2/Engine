import { Captured, IController } from "../controller/base";
import EmptyController from "../controller/empty";
import { Entities } from "../entity/entities";
import Renderer from "../render/renderer/base";

export type BaseConfiguration = {
    renderers?: Renderer[];
    controller?: IController;
    entities?: Entities;
};

export default abstract class BaseLoop {
    private renderers: Renderer[];
    private controller: IController;
    private entities: Entities;

    constructor(config: BaseConfiguration) {
        this.renderers = config.renderers ?? [];
        this.controller = config.controller ?? new EmptyController();
        this.entities = config.entities ?? new Entities();
    }

    protected prepare() {
        for (const renderer of this.renderers) renderer.prepare();
    }

    protected render() {
        for (const renderer of this.renderers) renderer.render();
    }

    protected update(delta: number, captured: Captured): void {
        const entities = this.entities.entities.keys();
        for (const entity of entities) {
            entity.update(delta, captured);
        }
    }

    protected capture(): Captured {
        return this.controller.toCaptured();
    }

    protected iterate(delta: number) {
        this.prepare();

        const captured = this.capture();
        this.update(delta, captured);

        this.render();        
    }
}