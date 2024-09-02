import { entities } from "../../../entity/entity";
import Collider from "../base";
import { IPlaceable } from "../../placeable/base";

export function intersectsWith(source: IPlaceable, target: IPlaceable) {
        const square1 = [
            source.position.x,
            source.position.x + source.size.width,
            source.position.y,
            source.position.y + source.size.height,
        ];
        const square2 = [
            target.position.x,
            target.position.x + target.size.width,
            target.position.y,
            target.position.y + target.size.height,
        ];

        return (
            Math.min(square2[0], square2[1]) <=
                Math.max(square1[0], square1[1]) &&
            Math.min(square1[0], square1[1]) <=
                Math.max(square2[0], square2[1]) &&
            Math.min(square2[2], square2[3]) <=
                Math.max(square1[2], square1[3]) &&
            Math.min(square1[2], square1[3]) <= Math.max(square2[2], square2[3])
        );    
}

export default class SimpleCollider extends Collider {
    public intersectsWith(target: SimpleCollider): boolean {
        return intersectsWith({
            position: this.globalPosition,
            size: this.size,
        }, {
            position: target.globalPosition,
            size: target.size,
        });
    }

    public intersects(): SimpleCollider[] {
        const intersects: SimpleCollider[] = [];

        for (const entity of entities(this).entities.keys()) {
            if (!(entity instanceof SimpleCollider) || entity === this)
                continue;
            if (this.intersectsWith(entity)) intersects.push(entity);
        }

        return intersects;
    }

    public update(): void {
        const intersects = this.intersects();
        if (intersects.length === 0) return;

        const event = new CustomEvent(`${this.constructor.name}:intersect`, {
            detail: intersects,
        });
        this.dispatchEvent(event);
    }
}