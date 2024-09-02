

import Collider from "../engine/base/collider/base";
import SimpleCollider from "../engine/base/collider/square/simple";
import Placeable from "../engine/base/placeable/base";
import Square from "../engine/base/renderables/square/base";
import { Captured } from "../engine/controller/base";
import { Decorate, is } from "../engine/decorators";
import Entity, { EntitiesSymbol } from "../engine/entity/entity";
import make from "../engine/entity/make";
import Point from "../engine/primitives/point";
import Size from "../engine/primitives/size";
import { RendererSymbol } from "../engine/render/renderable/base";
import Canvas2dRenderable from "../engine/render/renderable/canvas2d/base";
import HTMLRenderable from "../engine/render/renderable/html/base";
import Canvas2DRenderer from "../engine/render/renderer/canvas2d/base";
import HTMLRenderer from "../engine/render/renderer/html/renderer";
import { Scene } from "../engine/scene/scene";

// TODO: сделать систему позиционирования (в т. ч. возможность позиционирования относительно World/Entity),
// а также возможность использования разных единиц измерения
// TODO: доделать parent/child и вызывать destroy цепочкой + добавить setParent

// Избавится от такой инициализации, вся подобная работа должна быть сделана
// самим пользователем

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

const root = document.querySelector("#root2") as HTMLDivElement;

export const CanvasRenderer = new Canvas2DRenderer(canvas);
export const UIRenderer = new HTMLRenderer(root);

@Decorate({ expose: true })
class Wall extends Square {
    private collider: SimpleCollider;

    constructor() {
        super();
        this.collider = make(SimpleCollider, {
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

class Menu extends Entity {
    private items: unknown[] = [];
    private counter = 0;
    private renderer: MenuRenderer;

    public update(delta: number, captured: Captured): void {
        this.counter++;
        this.renderer.counter = this.counter;

        if (captured.keyboard.length !== 0)
            this.items.push("dskj" + this.items.length);
    }

    constructor() {
        super();

        this.renderer = make(MenuRenderer, {
            items: this.items,
            counter: this.counter,
            parent: this
        });
    }
}

class Player extends Square {
    private collider: Collider;
    constructor() {
        super();
        
        this.size = new Size(30, 30);
        this.position = new Point(300, 70);

        make(Square, {
            position: new Point(10, 10),
            size: new Size(10, 10),
            parent: this,      
            color: "#ff00ff",      
        });

        this.collider = make(SimpleCollider, {
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

const scene = new Scene('hello scene', async function() {
    const { InjectContext, Entities } = this.realm;

    // realm.InjectContext.set(Placeable, 'position', () => new Point(0, 0));
    // realm.InjectContext.set(Placeable, 'size', () => new Size(0, 0));
    InjectContext.set(Placeable, 'parent', undefined);
    InjectContext.set(Canvas2dRenderable, RendererSymbol, CanvasRenderer);
    InjectContext.set(HTMLRenderable, RendererSymbol, UIRenderer);
    InjectContext.set(Entity, EntitiesSymbol, Entities);
    InjectContext.set(Square, 'color', "#ff0000");

    make(Menu, {
        size: new Size(300, 200),
        position: new Point(0, 0),
    });
    make(Wall, {
        size: new Size(50, 50),
        position: new Point(100, 100),
        color: '#00FF00'
    });
    make(Wall, {
        size: new Size(20, 20),
        position: new Point(200, 100),
        color: '#00FF00',
    });
    make(Player);
});


export {
    scene as simpleScene,
}