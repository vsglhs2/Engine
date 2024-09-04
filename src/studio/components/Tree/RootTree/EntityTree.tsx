import Entity from "@/engine/entity/entity";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Menu, MenuItem, Typography } from "@mui/joy";
import { FC, useCallback } from "react";
import './Tree.Module.scss';
import { WithContextMenu } from "@/studio/ui";
import { globalSerializer, telescope, tree } from "@/studio/stores";
import { t } from "i18next";
import { observer } from "mobx-react-lite";
import { EntityDerived } from "@/engine/decorators";

type EntityTreeProps = {
    entity: Entity;
};

// Do tree virtualization and proper memoization

export const EntityTree: FC<EntityTreeProps> = observer(({ entity }) => {
    const { children } = entity;
    const name = globalSerializer.getEntityName(entity);
    const expanded = tree.getExpanded(entity);

    const onCreateEntity = useCallback(async () => {
        const response = await telescope.request({ 
            options: globalSerializer.exposedKeys,
            require: true,
        });

        if (response.type === 'closed') return;
        const { option: key } = response;

        const Constructor = globalSerializer.getExposedConstructor(key);
        // FIXME fix type
        const object = entity.make(Constructor as EntityDerived, {
            parent: entity,
        });
        tree.setExpanded(object, true);
        console.log('Created', key, object);
    }, [globalSerializer.exposedKeys]);

    const onRenameEntity = useCallback(async () => {
        const response = await telescope.request({
            require: false,
            defaultValue: name,
        });
        if (response.type === 'closed') return;

        globalSerializer.setEntityName(entity, response.value);
    }, [entity, name]);

    const onDeleteEntity = useCallback(async () => {
        entity.destroy();
    }, [entity]);

    const onChangeAccordion = useCallback((_: unknown, expanded: boolean) => {
        tree.setExpanded(entity, expanded);
    }, [entity]);

    if (!children.length) return (
        <WithContextMenu className="typography-container">
            <Menu>
                <MenuItem onClick={onCreateEntity}>
                    {t(`Create entity`)}
                </MenuItem>
                <MenuItem onClick={onRenameEntity}>
                    {t(`Rename ${name}`)}
                </MenuItem>
                <MenuItem onClick={onDeleteEntity}>
                    {t(`Delete ${name}`)}
                </MenuItem>
            </Menu>
            <Typography style={{ padding: '2px 12px' }}>{name}</Typography>
        </WithContextMenu>
    );

    const details = children.map(
        (entity, i) => <EntityTree key={name + i} entity={entity} />
    );

    return (
        <WithContextMenu >
            <Menu>
                <MenuItem onClick={onCreateEntity}>
                    {t(`Create entity`)}
                </MenuItem>
                <MenuItem onClick={onRenameEntity}>
                    {t(`Rename ${name}`)}
                </MenuItem>
                <MenuItem onClick={onDeleteEntity}>
                    {t(`Delete ${name}`)}
                </MenuItem>
            </Menu>
            <Accordion
                expanded={expanded}
                onChange={onChangeAccordion}
            >
                <AccordionSummary slotProps={{
                    button: { style: { paddingTop: 2, paddingBottom: 2 } }
                }}>
                    {name}
                </AccordionSummary>
                <AccordionDetails slotProps={{
                    content: { style: { paddingTop: 0, paddingBottom: 0, paddingRight: 0 } }
                }}>
                    <AccordionGroup>
                        {details}
                    </AccordionGroup>
                </AccordionDetails>
            </Accordion>
        </WithContextMenu>
    );
});

