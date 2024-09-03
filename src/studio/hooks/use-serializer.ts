import { DecoratorConstructor } from "@/engine/decorators";
import Serializer from "@/engine/decorators/serializer";
import Entity from "@/engine/entity/entity";
import { useCallback, useMemo } from "react";

// TODO: перенести как стор

export function useSerializer() {
    const { exposedMap, serializableMap, namedMap } = Serializer.global;
    const exposedKeys = useMemo(() => Array.from(exposedMap.keys()), [exposedMap]);

    const getSerializableState = useCallback((key: string | DecoratorConstructor) => {
        const Constructor = typeof key === 'string' ? exposedMap.get(key) : key;
        if (!Constructor)
            throw new Error(`[${key}] is not exposed`);

        const state = serializableMap.get(Constructor);
        if (!state)
            throw new Error(`There is no serialize state for [${Constructor}]`);

        return state;
    }, [exposedMap, serializableMap]);

    const getExposedConstructor = useCallback((key: string) => {
        const Constructor = exposedMap.get(key);
        if (!Constructor)
            throw new Error(`[${key}] in not exposed`);

        return Constructor;
    }, [exposedMap]);

    const getEntityName = useCallback((entity: Entity) => {
        const name = namedMap.get(entity);
        
        return name;
    }, [namedMap]);

    const setEntityName = useCallback((entity: Entity, name: string) => {
        return namedMap.set(entity, name);
    }, [namedMap]);

    return {
        exposedKeys,
        getExposedConstructor,
        getSerializableState,
        getEntityName,
        setEntityName,
    };
}