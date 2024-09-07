import MountableRenderer from "../mountable";
import HTMLRenderingContext from "./context";

export default class HTMLRenderer extends MountableRenderer<HTMLRenderingContext> {
    constructor(root: HTMLDivElement) {
        const context = new HTMLRenderingContext(root);
        super(root, context);
    }

    public prepare(): void {
        this.context.clear();
    }
}

