import { Scene } from "@/engine/scene/scene";
import { action, isObservableObject, makeAutoObservable, makeObservable, observable } from "mobx";
import { RealmStore } from "./realm/realm";
import invariant from "tiny-invariant";
import Entity from "@/engine/entity/entity";
import { globalSerializer } from "./serializer";
import { sceneSerializer } from "@/engine/primitives/serializable";
import { splitOnce } from "../utils";
import { project } from "./project";

export type SerializedScene = {};

type SerializedField = {
    key: string;
    value: string;
};

// TODO: create map for serializable objects for recreate refs after deserialization

function serializeValue(this: RealmStore, value: unknown, keys?: string[]) {
    const self = this;
    const { Entities } = self;
    const initialValue = value;

    function replacer(this: Record<string, unknown>, key: string, value: unknown) {
        if (keys && this === initialValue && !keys.includes(key)) 
            return;

        if (!(value instanceof Object)) {
            const json = JSON.stringify(value);
            return `primitive#${json}`;
        }

        if (value instanceof Entity && key === '' && !keys) {
            const serializableFields = globalSerializer.getSerializableState(value);
            invariant(serializableFields);

            const serialized = serializeValue.call(self, value, Object.keys(serializableFields));
            const ConstructorName = value.constructor.name;
            const id = Entities.mapper.get(value);

            return `make-entity#${ConstructorName}#${id}#${serialized}`;
        }

        if (value instanceof Entity && key === '' && keys?.length === 0) {           
            const serializableFields = globalSerializer.getSerializableState(value);
            invariant(serializableFields);

            const serialized = serializeValue.call(self, value, Object.keys(serializableFields));
            const id = Entities.mapper.get(value);
            return `extend-entity#${id}#${serialized}`;
        }

        if (value instanceof Entity && keys && key !== '') {
            const id = Entities.mapper.get(value);
            return `ref-entity#${id}`;
        }

        if (sceneSerializer.canBeSerialized(value)) {
            const prepared = sceneSerializer.prepareToSerialize(value);
            invariant(prepared);

            const [constructor, args] = prepared;
            const payload = serializeValue.call(self, args);

            return `json#${constructor}#${payload}`;
        }

        if (key === '') return value;

        const json = JSON.stringify(value, replacer);
        return `raw#${json}`;
    }

    return JSON.stringify(value, replacer);
}

// TODO: refactor

function deserializeValue(this: RealmStore, value: string) {
    const self = this;
    const { Entities } = self;
    const refRecord: Record<string, ((entity: Entity) => void)[]> = {};

    function reviver(this: Record<string, unknown>, key: string, value: unknown) {
        if (typeof value !== 'string') return value;

        const [type, payload] = splitOnce(value, '#');

        if (type === 'primitive')
            return JSON.parse(payload);

        if (type === 'ref-entity') {
            const entity = Entities.backwardMapper.get(payload);
            if (entity) return entity;

            let refQueue = refRecord[payload];
            if (!refQueue) refQueue = refRecord[payload] = [];

            refQueue.push((entity) => this[key] = entity);
        }

        if (type === 'make-entity') {
            const [constructor, restPayload] = splitOnce(payload, '#');
            const [id, argsPayload] = splitOnce(restPayload, '#');
            const args = deserializeValue.call(self, argsPayload);
            const Constructor = globalSerializer.getExposedConstructor(constructor);
            invariant(Constructor);

            // @ts-ignore
            const entity = self.make(Constructor, {
                ...args,
                id, 
            });

            // TODO: redesign
            Object.assign(entity, args);

            return entity;
        }

        if (type === 'extend-entity') {
            const [id, argsPayload] = splitOnce(payload, '#');
            const args = deserializeValue.call(self, argsPayload);
            const entity = Entities.backwardMapper.get(id);
            if (entity) {
                Object.assign(entity, args);

                // TODO: reconsider
                Entities.add(entity, id);
                return;
            }

            let refQueue = refRecord[payload];
            if (!refQueue) refQueue = refRecord[payload] = [];

            refQueue.push((entity) => {
                Object.assign(entity, args);

                // TODO: reconsider
                Entities.add(entity, id);
            });
        }

        if (type === 'raw') 
            return JSON.parse(payload, reviver);

        if (type === 'json') {
            const [constructor, argsPayload] = splitOnce(payload, '#');
            const args = deserializeValue.call(self, argsPayload);

            return sceneSerializer.makeFromSerialized(constructor, args);
        }
    }

    const parsed = JSON.parse(value, reviver);

    for (const id in refRecord) {
        const entity = self.Entities.backwardMapper.get(id);
        if (!entity) continue;

        for (const callback of refRecord[id]) {
            callback(entity);
        }

        delete refRecord[id];
    }

    return parsed;
}

// THINK: convert it to SceneStore like RealmStore?

export class SceneStore {
    public scene?: Scene;
    public realm: RealmStore;

    constructor () {
        this.realm = new RealmStore();

        makeObservable(this, {
            scene: observable,
            realm: observable,
            activate: action,
        });
    }

    activate(scene: Scene) {
        if (this.scene) {
            const serialized = this.serialize();
            // TODO: дописать
            project.serializedRecord[this.scene.name] = serialized;
            this.scene.destroy();            
        }
        this.scene = undefined;

        // Make async later
        // await scene.load();
        const serialized = project.serializedRecord[scene.name];

        scene.load(this.realm);
        
        if (serialized) {
            const parsed: { entities: string[] } = JSON.parse(serialized);
            console.log('parsed', parsed);

            for (const entity of parsed.entities) {
                deserializeValue.call(this.realm, entity);
                console.log(entity)
            }
        }

        this.scene = isObservableObject(scene) ? scene : makeAutoObservable(scene);
    }

    public serialize() {
        invariant(this.scene);

        const { Entities } = this.realm;
        // move logic for entities to realm serializer instead global one
        const serializer = globalSerializer;
        const makeableEntities = Array.from(Entities.serializables.values());
        const serializedEntities: string[] = [];

        for (const entity of makeableEntities) {
            const serialized = serializeValue.call(this.realm, entity);
            serializedEntities.push(serialized);

            console.log('make', serialized);
            // const deserialized = deserializeValue.call(this.realm, serialized);
            //console.log(deserialized);
        }

        const extendableEntities = Array.from(Entities.entities.keys());
        for (const entity of extendableEntities) {
            const serialized = serializeValue.call(this.realm, entity, []);
            serializedEntities.push(serialized);

            console.log('extend', serialized);
        }

        return JSON.stringify({
            entities: serializedEntities,
        });
    }
}

export const scene = new SceneStore();
