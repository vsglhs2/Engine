import SquareCollider from "@/engine/base/collider/square/base";
import Collider from "../engine/base/collider/base";
import SimpleCollider from "../engine/base/collider/square/simple";
import Square from "../engine/base/renderables/square/base";
import { Captured } from "../engine/controller/base";
import { Decorate, is, serializable } from "../engine/decorators";
import Entity from "../engine/entity/entity";
import Point from "../engine/primitives/point";
import Size from "../engine/primitives/size";
import HTMLRenderable from "../engine/render/renderable/html/base";
import { Scene } from "../engine/scene/scene";
import { InPlaceCanvasAndHTMLEnvironment } from "@/engine/environment";

// TODO: сделать систему позиционирования (в т. ч. возможность позиционирования относительно World/Entity),
// а также возможность использования разных единиц измерения

@Decorate({ expose: true })
class Wall extends Square {
    private collider: SimpleCollider;

    constructor() {
        super();
        this.collider = this.make(SimpleCollider, {
            parent: this,
        });
    }
}

@Decorate({
    items: is(Array),
    counter: is(Number),
})
class MenuRenderer extends HTMLRenderable {
    private menu: HTMLDivElement;

    declare items: unknown[];
    declare counter: number;

    constructor() {
        super();

        this.menu = document.createElement("div");
        this.menu.className = "menu";
    }

    render(): void {
        this.menu.innerText =
            this.items.length.toString() + " " + this.counter + ' ' + score;

        this.context.render(this.menu);
    }
}

class Logger extends Entity {
    public update(delta: number, captured: Captured): void {
        console.dir(delta, captured);
    }
}

let score = 0;

@Decorate({ expose: true })
class Menu extends MenuRenderer {
    public update(delta: number, captured: Captured): void {
        this.counter++;

        if (captured.keyboard.length !== 0)
            this.items.push("dskj" + this.items.length);
    }
}

@Decorate({
    expose: true,
    isMoving: serializable(Boolean),
    speed: serializable(Number),
    collider: serializable(Collider),
})
class Player extends Square {
    declare isMoving: boolean;
    declare speed: number;
    declare collider: Collider;

    constructor() {
        super();
        
        this.size = new Size(30, 30);
        this.position = new Point(300, 70);
        this.isMoving = false;
        this.speed = 10;

        this.make(Square, {
            position: new Point(10, 10),
            size: new Size(10, 10),
            parent: this,      
            color: "#ff00ff",      
        });

        this.make(Wall, {
            position: new Point(100, 100),
            size: new Size(10, 10),
            parent: this,      
            color: "#ff00ff",      
        });

        this.collider = this.make(SimpleCollider, {
            parent: this,            
        });

        // collider.addEventListener(
        //     `${SimpleCollider.name}:intersect`,
        //     (e: Event) => {
        //         const intersects = e.detail as SimpleCollider[];
        //         console.log(intersects);

        //         if (intersects.length) {
        //             console.warn("intersects with: ", intersects.length);
        //             score += intersects.length;
        //         }
                    
        //         for (const intersect of intersects) {
        //             // intersect.destroy();
        //             this.moveBy(new Point(-10, -10));
        //         }
        //     }
        // );
    }

    public update(delta: number, captured: Captured): void {
        const shift = new Point(0, 0);

        //if (captured.keyboard.length) console.warn(captured.keyboard);
        if (captured.keyboard.includes("w")) {
            shift.y -= delta;
            //console.log("w");
        } else if (captured.keyboard.includes("d")) {
            //console.log("d");
            shift.x += delta;
        } else if (captured.keyboard.includes("s")) {
            //console.log("s");
            shift.y += delta;
        } else if (captured.keyboard.includes("a")) {
            //console.log("a");
            shift.x -= delta;
        }

        this.moveBy(shift.mutateEach((a) => a / 4));

        console.log(this.collider.intersects().length)
        if (this.collider.intersects().length) {
            delta = -1.25 * delta;
            if (captured.keyboard.includes("w")) {
                shift.y -= delta;
                //console.log("w");
            } else if (captured.keyboard.includes("d")) {
                //console.log("d");
                shift.x += delta;
            } else if (captured.keyboard.includes("s")) {
                //console.log("s");
                shift.y += delta;
            } else if (captured.keyboard.includes("a")) {
                //console.log("a");
                shift.x -= delta;
            }

            this.moveBy(shift.mutateEach((a) => a / 4));
        }
    }
}

const scene = new Scene<InPlaceCanvasAndHTMLEnvironment>('hello scene', function() {
    // this.make(Menu, {
    //     size: new Size(300, 200),
    //     position: new Point(0, 0),
    //     items: [],
    //     counter: 9,
    // });
    // this.make(Wall, {
    //     size: new Size(50, 50),
    //     position: new Point(100, 100),
    //     color: '#00FF00'
    // });
    // this.make(Wall, {
    //     size: new Size(20, 20),
    //     position: new Point(200, 100),
    //     color: '#00FF00',
    // });
    // this.make(Player);
    // this.make(SquareCollider);
});

export default scene;