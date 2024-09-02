import { Realm, Realms } from "../realm";

// Может быть, стоит сделать сцену как прокси
export class Scene {
    public name: string;
    public realm: Realm;
    private loader: () => Promise<void>;
    
    constructor (name: string, load?: (this: Scene) => Promise<void>) {
        this.name = name;
        this.realm = new Realm();
        Realms.push(this.realm);

        const loader = load ? load : async () => {};
        this.loader = loader.bind(this);
    }

    public async load() {
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
