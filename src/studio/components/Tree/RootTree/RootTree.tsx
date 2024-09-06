import { FC, useCallback, useEffect, useRef } from "react";
import { EntityTree } from "./EntityTree";
import { AccordionGroup, Menu, MenuItem } from "@mui/joy";
import { ContextMenu } from "@/studio/ui";
import { activeScene, globalSerializer, telescope } from "@/studio/stores";
import { EntityDerived } from "@/engine/decorators";
import './Tree.Module.scss';
import { RootEntity } from "@/engine/entity/root";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import Entity from "@/engine/entity/entity";

type RootTreeProps = {
    root: RootEntity;
};

export const RootTree: FC<RootTreeProps> = observer(({ root }) => { 
    const { t } = useTranslation();
    
    const trees = root.children.map((entity, i) =>
        <EntityTree
            key={entity.constructor.name + i}
            entity={entity}
        />
    );

    const onCreateEntity = useCallback(async () => {
        const response = await telescope.request({ 
            options: globalSerializer.exposedKeys,
            require: true,
        });

        if (response.type === 'closed') return;
        const { option: key } = response;

        const Constructor = globalSerializer.getExposedConstructor(key);
        // FIXME fix type
        const object = activeScene.realm.make(Constructor as EntityDerived);
        console.log('Created', key, object);
    }, [globalSerializer.exposedKeys]);

    useEffect(() => {
        return monitorForElements({
            onDrop({ location, source }) {
                console.log('source', source);
                const target = location.current.dropTargets[0];
                console.log('target', target);
                if (!target) return;

                const { entity: targetEntity, type } = target.data;

                console.log('target entity', targetEntity, type);
                if (!(targetEntity instanceof Entity) || typeof type !== 'string') 
                    return;

                const { entity: sourceEntity } = source.data;

                console.log('source entity', sourceEntity);
                if (!(sourceEntity instanceof Entity))
                    return;

                if (type === 'current') {
                    sourceEntity.parent = targetEntity;
                } else if (type === 'up') {
                    targetEntity.parent?.after(sourceEntity, targetEntity);
                }
            },
        })
    }, []);

    return (
        <ContextMenu className="root-tree">
            <Menu>
                <MenuItem onClick={onCreateEntity}>
                    {t(`Create new entity`)}
                </MenuItem>
            </Menu>
            <AccordionGroup style={{ overflowX: 'hidden' }}>
                {trees}
            </AccordionGroup>            
        </ContextMenu>

    )
});