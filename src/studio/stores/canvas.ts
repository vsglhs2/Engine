import SimpleCollider from "@/engine/base/collider/square/simple";
import Point from "@/engine/primitives/point";
import Size from "@/engine/primitives/size";
import { RealmSymbol } from "@/engine/realm";
import { makeAutoObservable } from "mobx";
import { scene } from "./scene";
import { context } from "./context";
import Placeable from "@/engine/base/placeable/base";
import invariant from "tiny-invariant";
import { entities } from "@/engine/entity/entity";

const DEFAULT_POINTER = -1;

function pointFromEvent(e: MouseEvent, relativeTo: HTMLElement) {
    const target = e.target as HTMLElement;
    const { x: targetX, y: targetY } = target.getBoundingClientRect();
    const { left, top } = relativeTo.getBoundingClientRect();
    const x = targetX - left + e.offsetX;
    const y = targetY - top + e.offsetY;
    
    return new Point(x, y);
}

export class CanvasStore {
    public collided: Placeable[];
    public pointer: number;
    public locked: Placeable[];

    public preventClick: boolean;
    public isDragging: boolean;
    public previousPosition: Point;
    public root?: HTMLElement;

    public clickHandler: (e: MouseEvent) => void;
    public doubleClickHandler: (e: MouseEvent) => void;
    public downHandler: (e: MouseEvent) => void;
    public upHandler: (e: MouseEvent) => void;
    public moveHandler: (e: MouseEvent) => void;
    public bindHandlers: (root: HTMLElement) => () => void;

    constructor() {
        this.collided = [];
        this.locked = [];
        this.pointer = DEFAULT_POINTER;  
        this.previousPosition = new Point(0, 0);
        this.isDragging = false;
        this.preventClick = false;

        const cursor = {
            // Перенести в computedFn ?
            [RealmSymbol]: scene.realm,
            globalPosition: new Point(0, 0),
            size: new Size(1, 1),
        };

        const getPointedPlaceable = () => {
            return this.collided[this.pointer];
        };

        this.clickHandler = (e: MouseEvent) => {
            if (this.preventClick) {
                this.preventClick = false;
                return;
            }

            console.log(e.defaultPrevented)
            if (this.pointer !== DEFAULT_POINTER) {
                const pointed = getPointedPlaceable();
                invariant(pointed);
                console.log('put', pointed);

                context.putEntity(pointed);
            }

            const pointed = getPointedPlaceable();
            
            // console.log('pointed', pointed);

            if (!pointed) {
                context.stack.length && context.popEntity();
                this.locked.length = 0;

                return;
            }

            this.locked.splice(0, this.locked.length, this.collided[this.pointer]);
            
        };

        this.doubleClickHandler = () => {};

        this.downHandler = (e: MouseEvent) => {
            const point = pointFromEvent(e, this.root!);
            cursor.globalPosition.shiftTo(point);

            // TODO: redo when will redesign collider mechanics
            const keys = entities(cursor).entities.keys();
            const placeables: Placeable[] = [];
            
            for (const entity of keys) {
                if (!(entity instanceof Placeable)) continue;
        
                const isIntersected = SimpleCollider.prototype.intersectsWith.call(cursor, entity);
                if (!isIntersected) continue;

                placeables.push(entity);
            }

            console.log(placeables)

            const previousColliders = this.collided.splice(0);
            this.collided.push.apply(this.collided, placeables);

            const isSameColliders = this.collided.every((c, i) => c === previousColliders[i]);
            const canPointFurther = this.pointer < previousColliders.length - 1;
            const needPointFurther = this.collided.length > 1;

            const canPointToHead = Boolean(this.collided.length);

            if (isSameColliders && needPointFurther && canPointFurther) {
                this.pointer++;
            } else if (canPointToHead) {
                this.pointer = 0;
            } else {
                this.pointer = DEFAULT_POINTER;
                this.locked.length = 0;
            }

            console.log(this.pointer);

            this.previousPosition.shiftTo(point);

            this.isDragging = true;
            this.previousPosition.shiftTo(point);
        };

        this.upHandler = () => {
            this.isDragging = false;
        };

        this.moveHandler = (e: MouseEvent) => {
            if (!this.locked.length || !this.isDragging) return;

            const point = pointFromEvent(e, this.root!);
            // console.log('point', point);
            // console.log('prev', this.previousPosition);

            const shifted = point.toSubBy(this.previousPosition);
            // console.log('shifted', shifted);


            for (const placeable of this.locked) {
                placeable.moveBy(shifted);
            }

            this.previousPosition.shiftTo(point);
            // console.log('prev2', this.previousPosition);

            this.preventClick = true;
        };

        this.bindHandlers = (root) => {
            this.root = root;

            const { 
                clickHandler,
                doubleClickHandler, 
                downHandler,
                moveHandler, 
                upHandler 
            } = canvas;
    
            root.addEventListener('mousedown', downHandler);
            root.addEventListener('mouseup', upHandler);            
            root.addEventListener('click', clickHandler);
            root.addEventListener('dblclick', doubleClickHandler);
            root.addEventListener('mousemove', moveHandler);
    
            return () => {
                this.root = undefined;
                root.removeEventListener('click', clickHandler);
                root.removeEventListener('dblclick', doubleClickHandler);
                root.removeEventListener('mousedown', downHandler);
                root.removeEventListener('mouseup', upHandler);
                root.removeEventListener('mousemove', moveHandler);
            };
        }

        makeAutoObservable(this, {
            previousPosition: false,
            isDragging: false,
            preventClick: false,
            root: false,
        });
    }
}

export const canvas = new CanvasStore();