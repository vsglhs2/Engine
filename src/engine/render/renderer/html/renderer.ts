import Renderer from "../base";
import HTMLRenderingContext from "./context";

export default class HTMLRenderer extends Renderer<HTMLRenderingContext> {
    constructor(root: HTMLDivElement) {
        const context = new HTMLRenderingContext(root);
        super(context);
    }

    public prepare(): void {
        this.context.clear();
    }
}

