import { Any, AnyConstructor } from "@/engine/decorators";
import { ConverterValueStore } from "./value";
import { makeAutoObservable } from "mobx";
import { computedFn } from "mobx-utils";
import { walkPrototypeChain } from "@/engine/decorators/utils/prototype";
import invariant from "tiny-invariant";
import { FunctionComponent } from "react";

export type ConverterProps<Value = any, As = AnyConstructor> = { store: ConverterValueStore<Value, As> };
export type ConvertibleValueComponent = FunctionComponent<ConverterProps>;

export class ConverterComponentsStore {
    declare getConvertibleValueComponent: (Constructor: AnyConstructor) => ConvertibleValueComponent;
    public componentMap: Map<AnyConstructor, ConvertibleValueComponent>;

    constructor() {
        this.componentMap = new Map();
        makeAutoObservable(this);

        this.getConvertibleValueComponent = computedFn((Constructor: AnyConstructor) => {
            const NearbyConstructor = walkPrototypeChain(
                Constructor, 
                (Constructor) => Boolean(this.componentMap.get(Constructor))
            ) ?? Any;

            const Component = this.componentMap.get(NearbyConstructor);
            invariant(Component);

            return Component;
        });
    }

    addConvertibleValueComponent(Constructor: AnyConstructor, Component: ConvertibleValueComponent) {
        this.componentMap.set(Constructor, Component);
    }
}

export const converterComponents = new ConverterComponentsStore();