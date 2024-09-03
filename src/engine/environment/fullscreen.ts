import Canvas2DRenderer from "../render/renderer/canvas2d/base";
import HTMLRenderer from "../render/renderer/html/renderer";
import { Environment } from "./base";

export class FullscreenEnvironment extends Environment {
    // TODO: подумать, как избежать необходимости такого использования
    public CanvasRenderer: Canvas2DRenderer;
    public UIRenderer: HTMLRenderer;

    constructor() {
        super();

        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;

        const root = document.createElement("div") as HTMLDivElement;
        root.style.width = `${document.body.clientWidth}px`;
        root.style.height = `${document.body.clientHeight}px`;

        const CanvasRenderer = new Canvas2DRenderer(canvas);
        const UIRenderer = new HTMLRenderer(root);

        this.renderers.push(CanvasRenderer, UIRenderer);
        this.CanvasRenderer = CanvasRenderer;
        this.UIRenderer = UIRenderer;
    }
}