import { Captured } from "../../../controller/base";
import Point from "../../../primitives/point";
import Size from "../../../primitives/size";
import Placeable from "../../placeable/base";
import Collider from "../base";

type PositionAreas = Map<Point, Map<Point, Map<Placeable, true>>>;
type PositionKeys = WeakMap<Placeable, [Point, Point]>;

export default class SquareCollider extends Collider {
    protected static PositionAreas: PositionAreas = new Map();
    protected static PositionKeys: PositionKeys = new WeakMap();

    constructor () {
        super();

        this.updateIntersectTarget(this);
    }

    private getIntersectKeys(position: Point) {
        for (const [key1, col] of SquareCollider.PositionAreas) {
            if (!(position.x >= key1.x && position.x <= key1.y)) continue;

            for (const key2 of col.keys()) {
                if (position.y >= key2.x && position.y <= key2.y) return [key1, key2];
            }
        }
    }

    public static fillIntersectMap(size: Size, areaSize: Size) {
        const w = Math.ceil(size.width / areaSize.width);
        const h = Math.ceil(size.height / areaSize.height);

        for (let x = 0; x < w; x++) {
            const map = new Map<Point, Map<Placeable, true>>();
            const dif = x === w - 1 ? 0 : 1;
            const point = new Point(x * areaSize.width, (x + 1) * areaSize.width + dif);

            const area = SquareCollider.PositionAreas.set(point, map).get(point) as typeof map;
            for (let y = 0; y < h; y++) {
                const map = new Map<Placeable, true>();
                const dif = y === h - 1 ? 0 : 1;
                const point = new Point(y * areaSize.height, (y + 1) * areaSize.height + dif);

                area.set(point, map);
            }
        }
    }

    private getIntersectMap(target: Point) {
        const keys = this.getIntersectKeys(target);
        if (!keys) return;

        const [key1, key2] = keys;
        return SquareCollider.PositionAreas.get(key1)?.get(key2);
    }

    private updateIntersectTarget(target: SquareCollider) {
        const keys = SquareCollider.PositionKeys.get(target);
        if (keys) {
            const prevMap = SquareCollider.PositionAreas.get(keys[0])?.get(keys[1]);
            prevMap?.delete(target);
            SquareCollider.PositionKeys.delete(this);
        }

        const newKeys = this.getIntersectKeys(target.globalPosition);
        if (!newKeys) return;

        SquareCollider.PositionKeys.set(this, newKeys as [Point, Point]);
    }

    private checkIntersectWith(target: SquareCollider) {
        const square1 = [
            this.globalPosition.x,
            this.globalPosition.x + this.size.width,
            this.globalPosition.y,
            this.globalPosition.y + this.size.height,
        ];
        const square2 = [
            target.globalPosition.x,
            target.globalPosition.x + target.size.width,
            target.globalPosition.y,
            target.globalPosition.y + target.size.height,
        ];

        return (
            (Math.min(square2[0], square2[1]) <= Math.max(square1[0], square1[1])) &&
            (Math.min(square1[0], square1[1]) <= Math.max(square2[0], square2[1])) &&
            (Math.min(square2[2], square2[3]) <= Math.max(square1[2], square1[3])) &&
            (Math.min(square1[2], square1[3]) <= Math.max(square2[2], square2[3]))
        );
    }

    protected intersects() {
        // Здесь нужно возвращать
        // xxx
        // xox
        // xxx
        // сетку [Point, Point], вместо одной Map'ы

        const targets = this.getIntersectMap(this.globalPosition);
        const keys = targets?.keys() ?? [];
        const intersects: SquareCollider[] = [];

        for (const target of keys) {
            if (this.checkIntersectWith(target)) intersects.push(target);
        }

        return intersects;
    }

    public destroy(): void {
        super.destroy();

        const key = SquareCollider.PositionKeys.get(this);
        if (!key) return;

        this.getIntersectMap(this.globalPosition)?.delete(this);
    }

    protected intersectsWith(target: SquareCollider) {
        return this.intersects() ?? false;
    }

    public update(delta: number, captured: Captured): void {
        const prev = this.globalPosition.copy();
        super.update(delta, captured);

        if (!prev.equals(this.globalPosition)) this.updateIntersectTarget(this);
    }
}
