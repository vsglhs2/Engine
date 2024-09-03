import { Environment } from "../environment/base";
import { Realm, Realms } from "../realm";

// Может быть, стоит сделать сцену как прокси
export class Scene<Env extends Environment = Environment> {
    public name: string;
    public realm!: Realm;
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
