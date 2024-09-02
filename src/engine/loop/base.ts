import { Captured, IController } from "../controller/base";
import EmptyController from "../controller/empty";
import { Realms } from "../realm";
import Renderer from "../render/renderer/base";

export type BaseConfiguration = {
    renderers: Renderer[];
    controller?: IController;
};

export default abstract class BaseLoop {
    private renderers: Renderer[];
    private controller: IController;

    constructor(config: BaseConfiguration) {
        this.renderers = config.renderers;
        this.controller = config.controller ?? new EmptyController();
    }

    protected prepare() {
        for (const renderer of this.renderers) renderer.prepare();
    }

    protected render() {
        for (const renderer of this.renderers) renderer.render();
    }

    protected update(delta: number, captured: Captured): void {
        const { Entities } = Realms.active();
        for (const entity of Entities.entities.keys()) {
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