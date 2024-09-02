import Size from "../../../primitives/size";
import Renderer from "../base";

export default class Canvas2DRenderer extends Renderer<CanvasRenderingContext2D> {
    private size: Size;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        super(ctx);

        this.size = new Size(canvas.width, canvas.height);
    }

    public render(): void {
        const context = this.context;
        for (const renderable of this.renderables.keys()) {
            context.save();
            renderable.render();
            context.restore();
        }
    }

    public prepare(): void {
        this.context.clearRect(0, 0, this.size.width, this.size.height);
    }
}