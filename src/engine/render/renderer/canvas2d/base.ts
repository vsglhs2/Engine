import Size from "../../../primitives/size";
import MountableRenderer from "../mountable";

export default class Canvas2DRenderer extends MountableRenderer<CanvasRenderingContext2D> {
    private size: Size;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        super(canvas, ctx);

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

    resize(size: Size): void {
        const element = this.mountable as HTMLCanvasElement;

        element.width = size.width;
        element.height = size.height;
        this.size.width = size.width;
        this.size.height = size.height;

        console.log(size, element.width, element.height)
    }

    public prepare(): void {
        this.context.clearRect(0, 0, this.size.width, this.size.height);
    }
}