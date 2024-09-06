import { ConverterValueStore } from "./value";
import { makeAutoObservable } from "mobx";
import { computedFn } from "mobx-utils"
import Entity from "@/engine/entity/entity";
import { AnyConstructor } from "@/engine/decorators";

export type ConverterValuesRecord = Record<string | symbol, ConverterValueStore>;

export class ConverterValuesStore {
    declare getValuesRecord: (entity: Entity) => ConverterValuesRecord;
    declare getValue: (entity: Entity, key: string | symbol) => ConverterValueStore | undefined;
    public valuesMap: WeakMap<Entity, ConverterValuesRecord>;

    constructor() {
        this.valuesMap = new WeakMap();  
        makeAutoObservable(this, {
            valuesMap: false,
        });

        this.getValuesRecord = computedFn((entity: Entity) => {
            let record = this.valuesMap.get(entity);
            if (!record) record = this.valuesMap.set(entity, {}).get(entity)!;

            return record;
        });

        this.getValue = computedFn((entity: Entity, key: string | symbol) => {
            let record = this.valuesMap.get(entity);
            if (!record) return;

            return record[key];
        });
    }

    createValueForKey(entity: Entity, key: string | symbol, as: AnyConstructor) {
        const store = new ConverterValueStore(entity, key, as);

        const record = this.getValuesRecord(entity);
        record[key] = store;

        return store;
    }
}

export const converterValues = new ConverterValuesStore();