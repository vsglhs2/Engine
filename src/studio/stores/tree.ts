import { action, makeObservable, observable } from "mobx";
import { globalSerializer, SerializerStore } from "./serializer";
import Entity from "@/engine/entity/entity";
import { computedFn } from "mobx-utils";

export type NodeState = {
    expanded: boolean;
    draggedOver: boolean;
    dragging: boolean;
    // label: string;
};

export class TreeStore {
    declare getState: (entity: Entity) => NodeState;
    declare getExpanded: (entity: Entity) => NodeState['expanded'];
    declare getDraggedOver: (entity: Entity) => NodeState['draggedOver'];
    declare getDragging: (entity: Entity) => NodeState['dragging'];

    public serializer: SerializerStore;
    // WeakMap ?
    public state: Map<Entity, NodeState> = new Map();

    constructor (serializer: SerializerStore) {
        this.serializer = serializer;

        makeObservable(this, {
            state: observable,
            setState: action,
            setDraggedOver: action,
            setDragging: action,
            setExpanded: action,
            toggleExpanded: action,
        });

        this.getState = computedFn((entity: Entity) => {
            if (!this.state.has(entity)) {
                this.setState(entity, { 
                    expanded: false,
                    draggedOver: false,
                    dragging: false,
                    selected: false
                });
            }
    
            return this.state.get(entity)!;
        });
    
        this.getExpanded = computedFn((entity: Entity) => this.getState(entity).expanded);
        this.getDraggedOver = computedFn((entity: Entity) => this.getState(entity).draggedOver);
        this.getDragging = computedFn((entity: Entity) => this.getState(entity).dragging);
    }

    setState(entity: Entity, state: NodeState) {
        this.state.set(entity, state);
        return state;
    }

    setDragging(entity: Entity, expanded: NodeState['expanded']) {
        const state = this.getState(entity);
        state.expanded = expanded;
    }

    setDraggedOver(entity: Entity, expanded: NodeState['expanded']) {
        const state = this.getState(entity);
        state.expanded = expanded;
    }

    setExpanded(entity: Entity, expanded: NodeState['expanded']) {
        const state = this.getState(entity);
        state.expanded = expanded;
    }

    toggleExpanded(entity: Entity) {
        const state = this.getState(entity);
        state.expanded = !state.expanded;
    }

    destroy() {
        this.state.clear();
    }
}

export const tree = new TreeStore(globalSerializer);