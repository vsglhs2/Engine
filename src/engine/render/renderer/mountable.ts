import Size from "@/engine/primitives/size";
import Renderer from "./base";
import { RendererContext } from "./utils";

export default class MountableRenderer<
    Context extends RendererContext
> extends Renderer<Context> {
    protected mountable: HTMLElement;

    constructor(mountable: HTMLElement, context: Context) {
        super(context);

        this.mountable = mountable;
    }

    mount(container: HTMLElement) {
        container.appendChild(this.mountable);

        return () => {
            this.mountable.remove();
        };
    }

    resize(size: Size) {
        this.mountable.style.width = `${size.width}px`;
        this.mountable.style.height = `${size.height}px`;
    }

    public destroy(): void {
        super.destroy();
        this.mountable.remove();
    }
}

