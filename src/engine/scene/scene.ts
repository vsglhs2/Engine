import Square from "../base/renderables/square/base";
import Entity from "../entity/entity";
import { MakeFunction } from "../entity/make";
import { Environment } from "../environment/base";
import { Realm, Realms, RealmSymbol } from "../realm";
import { RendererSymbol } from "../render/renderable/base";
import Canvas2dRenderable from "../render/renderable/canvas2d/base";
import HTMLRenderable from "../render/renderable/html/base";
import Canvas2DRenderer from "../render/renderer/canvas2d/base";
import HTMLRenderer from "../render/renderer/html/renderer";

export class Scene<Env extends Environment = Environment> {
    public name: string;
    public realm!: Realm;
    public make!: MakeFunction;

    // THINK: создавать realm в environment, так как такие вещи, как Renderer именно от него зависят ?
    public environment!: Env;
    private loader: () => void;
    
    constructor (name: string, load?: (this: Scene<Env>) => void) {
        this.name = name;

        const loader = load ? load : () => {};
        this.loader = loader.bind(this);
    }

    public load(realm = new Realm()) {
        if (!this.environment) throw new Error('Can\'t load scene without environment');
        
        const { InjectContext } = this.realm = realm;
        Realms.push(this.realm);

        this.make = this.realm.make;

        const { renderers } = this.environment;
        for (const renderer of renderers) {
            // Подумать, как можно обобщить
            if (renderer instanceof HTMLRenderer) {
                InjectContext.set(HTMLRenderable, RendererSymbol, renderer);
            }

            if (renderer instanceof Canvas2DRenderer) {
                InjectContext.set(Canvas2dRenderable, RendererSymbol, renderer);
            }
        }

        InjectContext.set(Square, 'color', "#000000");
        InjectContext.set(Entity, RealmSymbol, this.realm);    
        InjectContext.set(Entity, 'parent', undefined);
        // TODO: разобраться, почему не выводится тип
        InjectContext.set(Entity, 'make', () => this.make);

        return this.loader();
    }

    public reload() {
        this.destroy();
        return this.load();
    }

    public destroy() {
        this.realm.destroy();
        this.environment.destroy();
        Realms.pop();
    }
}
