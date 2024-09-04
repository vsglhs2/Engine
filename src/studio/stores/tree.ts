import { action, makeObservable, observable } from "mobx";
import { globalSerializer, SerializerStore } from "./serializer";
import Entity from "@/engine/entity/entity";
import { computedFn } from "mobx-utils";

export type NodeState = {
    expanded: boolean;
    // label: string;
};

export class TreeStore {
    declare getState: (entity: Entity) => NodeState;
    declare getExpanded: (entity: Entity) => NodeState['expanded'];

    public serializer: SerializerStore;
    public state: Map<Entity, NodeState> = new Map();

    constructor (serializer: SerializerStore) {
        this.serializer = serializer;

        makeObservable(this, {
            state: observable,
            setState: action,
            setExpanded: action,
        });

        this.getState = computedFn((entity: Entity) => {
            if (!this.state.has(entity)) {
                this.setState(entity, { expanded: false, });
            }
    
            return this.state.get(entity)!;
        });
    
        this.getExpanded = computedFn((entity: Entity) => {
            const state = this.getState(entity);
    
            return state.expanded;
        });
    }

    setState(entity: Entity, state: NodeState) {
        this.state.set(entity, state);
        return state;
    }

    setExpanded(entity: Entity, expanded: NodeState['expanded']) {
        const state = this.getState(entity);
        state.expanded = expanded;
    }

    destroy() {
        this.state.clear();
    }
}

export const tree = new TreeStore(globalSerializer);