import Placeable from "../placeable/base";

export default abstract class Collider extends Placeable {
    public abstract intersectsWith(target: Collider): boolean;
    public abstract intersects(): Collider[];
}