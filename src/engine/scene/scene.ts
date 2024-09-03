import { Environment } from "../environment/base";
import { Realm, Realms } from "../realm";

// Может быть, стоит сделать сцену как прокси
export class Scene<Env extends Environment = Environment> {
    public name: string;
    public realm: Realm;
    public environment!: Env;
    private loader: () => Promise<void>;
    
    constructor (name: string, load?: (this: Scene<Env>) => Promise<void>) {
        this.name = name;
        this.realm = new Realm();
        Realms.push(this.realm);

        const loader = load ? load : async () => {};
        this.loader = loader.bind(this);
    }

    public async load() {
        if (!this.environment) throw new Error('Can\'t load scene without environment');

        return this.loader();
    }

    public async reload() {
        this.destroy();
        return this.load();
    }

    public destroy() {
        this.realm.destroy();
        Realms.pop();
    }
}
