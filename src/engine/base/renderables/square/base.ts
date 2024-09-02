import { Decorate, injectableAndSerializable } from "../../../decorators";
import Canvas2dRenderable from "../../../render/renderable/canvas2d/base";
import { IPlaceable } from "../../placeable/base";

export type ColorPlaceableProps = IPlaceable & { color: string };

@Decorate({
    expose: true,
    color: injectableAndSerializable(String)
})
export default class Square extends Canvas2dRenderable {
    declare color: string;

    constructor () {
        super();
    }

    render(): void {
        const { color, size } = this;
        this.context.fillStyle = color;
        this.context.fillRect(
            this.globalPosition.x, 
            this.globalPosition.y, 
            size.width, 
            size.height
        );
    }
}
