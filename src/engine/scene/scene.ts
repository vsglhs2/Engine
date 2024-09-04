import { MakeFunction } from "../entity/make";
import { Environment } from "../environment/base";
import { Realm, Realms } from "../realm";

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
        
        this.realm = realm;
        Realms.push(this.realm);

        this.make = this.realm.make;

        return this.loader();
    }

    public reload() {
        this.destroy();
        return this.load();
    }

    public destroy() {
        this.realm.destroy();
        Realms.pop();
    }
}
