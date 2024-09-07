import Placeable from "../../base/placeable/base";
import { Captured } from "../../controller/base";
import { Decorate, injectable } from "../../decorators";
import Renderer from "../renderer/base";
import { RendererContext } from "../renderer/utils";

export const RendererSymbol = Symbol('Renderer');

// Подумать, нужно ли для Renderable быть наследованным от Placeable или Entity 
// (потанциально, нужно избавиться от update метода и оставить лишь render)
// Также нужно подумать, что действительно важно передавать в параметры для render
// к примеру, стоит передавать final position вместо текущего использования globalPosition

@Decorate({
    [RendererSymbol]: injectable(Renderer),
})
export default abstract class Renderable<
    R extends Renderer = Renderer,
    Context extends RendererContext = ReturnType<R["getContext"]>
> extends Placeable {
    declare [RendererSymbol]: R;

    protected context: Context;

    constructor() {
        super();

        this.context = this[RendererSymbol].getContext() as Context;
        this[RendererSymbol].addRenderable(this as Renderable);
    }
    
    abstract render(): void;

    destroy() {
        this[RendererSymbol].removeRenderable(this as Renderable);

        super.destroy();
    }

    public update(delta: number, captured: Captured): void {
        // Update for renderable won't be called
    }
}
