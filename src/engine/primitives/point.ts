import { sceneSerializer } from "./serializable";

export default class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    shiftBy(point: Point) {
        this.x += point.x;
        this.y += point.y;

        return this;
    }

    shiftTo(point: Point) {
        this.x = point.x;
        this.y = point.y;

        return this;
    }

    toShiftedBy(point: Point) {
        return new Point(this.x, this.y).shiftBy(point);
    }

    copy() {
        return new Point(this.x, this.y);
    }

    equals(point: Point) {
        return point.x === this.x && point.y === this.y;
    }

    subBy(point: Point) {
        this.x -= point.x;
        this.y -= point.y;

        return this;
    }

    toSubBy(point: Point) {
        return new Point(this.x, this.y).subBy(point);
    }

    //mutate(mut: ())

    mutateEach(mut: (arg: number) => number) {
        this.x = mut(this.x);
        this.y = mut(this.y);

        return this;
    }


}

sceneSerializer.registerSerializable(Point, function () {
    return [this.x, this.y];
});