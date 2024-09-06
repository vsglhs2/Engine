import { AnyConstructor } from "@/engine/decorators";
import Entity from "@/engine/entity/entity";
import { extendObservable, isObservable, isObservableProp, makeAutoObservable, observable } from "mobx";

function toObserved(target: unknown) {
    const isObject = target instanceof Object;
    if (!isObject) return target;

    const needExtend = isObservable(target);
    if (needExtend) return extendObservable(target, {});

    return makeAutoObservable(target);
}

export class ConverterValueStore<Value = unknown, As = AnyConstructor> {
    public entity: Entity;
    public key: string | symbol;
    public as: As;

    constructor (entity: Entity, key: string | symbol, as: As) {
        this.entity = entity;
        this.key = key;
        this.as = as;

        // @ts-ignore FIXME
        const observed = toObserved(entity[key]);
        // @ts-ignore
        if (!isObservableProp(this.entity, this.key)) {
            this.entity = extendObservable(this.entity, {
                [key]: observed,
            }, {
                [key]: observable
            });
        } else {
            // @ts-ignore FIXME
            this.entity[this.key] = observed;            
        }
  
        makeAutoObservable(this, {
            as: false,
        });
    }

    set(value: Value) {
        // @ts-ignore FIXME
        this.entity[this.key] = value;
    }

    change(key: keyof Value, value: Value[typeof key]) {
        // @ts-ignore FIXME
        this.entity[this.key][key] = value;
    }

    get value(): Value {
        // @ts-ignore FIXME
        return this.entity[this.key];
    }
}
