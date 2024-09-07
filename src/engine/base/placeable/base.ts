import { Decorate, injectableAndSerializable, Mark } from "../../decorators";
import Entity from "../../entity/entity";
import Point from "../../primitives/point";
import Size from "../../primitives/size";

export function MustGetRidOfThisPlaceableDefaults(entity: Entity) {
    if (!(entity instanceof Placeable)) return;

    // FIXME: get rid of this mess
    if (!entity.size && entity.parent instanceof Placeable) entity.size = entity.parent.size;

    if (!entity.position && entity.parent instanceof Placeable) entity.position = new Point(0, 0);

    if (!entity.size) entity.size = new Size(0, 0);
    if (!entity.position) entity.position = new Point(0, 0);
}

export interface IPlaceable {
    size: Size;
    position: Point;
    globalPosition: Point; // TODO: get rid when create proper Transform class
}

@Decorate({
    expose: true,
    size: injectableAndSerializable(Size, [true]),
    position: injectableAndSerializable(Point, [true]),
})
export default class Placeable extends Entity implements IPlaceable {
    declare size: Size;
    declare position: Point;

    public get globalPosition(): Mark<Point> {
        const adjustTo = this.parent instanceof Placeable
            ? this.parent.globalPosition
            : new Point(0, 0);

        return this.position.toShiftedBy(adjustTo);
    }

    constructor() {
        super();

        MustGetRidOfThisPlaceableDefaults(this);
    }

    public moveTo(point: Point) {
        this.position.x = point.x;
        this.position.y = point.y;
    }

    public moveBy(shift: Point) {
        this.position.shiftBy(shift);
    }

    public resize(size: Size) {
        this.size.width = size.width;
        this.size.height = size.height;
    }
}
