export default class Point {
    constructor(public x: number, public y: number) {}

    shiftBy(point: Point) {
        this.x += point.x;
        this.y += point.y;

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

    //mutate(mut: ())

    mutateEach(mut: (arg: number) => number) {
        this.x = mut(this.x);
        this.y = mut(this.y);

        return this;
    }
}
