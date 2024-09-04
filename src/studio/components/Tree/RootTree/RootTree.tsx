import { FC, useCallback } from "react";
import { EntityTree } from "./EntityTree";
import { AccordionGroup, Menu, MenuItem } from "@mui/joy";
import { WithContextMenu } from "@/studio/ui";
import { telescope } from "@/studio/stores";
import { useSerializer } from "@/studio/hooks";
import make from "@/engine/entity/make";
import { EntityDerived } from "@/engine/decorators";
import './Tree.Module.scss';
import { RootEntity } from "@/engine/entity/root";
import { useTranslation } from "react-i18next";

type RootTreeProps = {
    root: RootEntity;
};

export const RootTree: FC<RootTreeProps> = ({ root }) => { 
    const { t } = useTranslation();
    const { exposedKeys, getExposedConstructor } = useSerializer();
    
    const trees = root.children.map((entity, i) =>
        <EntityTree
            key={entity.constructor.name + i}
            entity={entity}
        />
    );
    const onCreateEntity = useCallback(async () => {
        const response = await telescope.request({ 
            options: exposedKeys,
            require: true,
        });

        if (response.type === 'closed') return;
        const { option: key } = response;

        const Constructor = getExposedConstructor(key);
        // FIXME fix type
        const object = make(Constructor as EntityDerived);
        console.log('Created', key, object);
    }, []);

    return (
        <WithContextMenu className="root-tree">
            <Menu>
                <MenuItem onClick={onCreateEntity}>
                    {t(`Create new entity`)}
                </MenuItem>
            </Menu>
            <AccordionGroup style={{ overflowX: 'hidden' }}>
                {trees}
            </AccordionGroup>            
        </WithContextMenu>

    )
} 