import Entity from "@/engine/entity/entity";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Menu, MenuItem, Typography } from "@mui/joy";
import { FC, useCallback } from "react";
import './Tree.Module.scss';
import { WithContextMenu } from "@/studio/ui";
import { telescope } from "@/studio/stores";
import { useSerializer } from "@/studio/hooks";
import { t } from "i18next";

type EntityTreeProps = {
    entity: Entity;
};

// Do tree virtualization

export const EntityTree: FC<EntityTreeProps> = ({ entity }) => {
    const { children } = entity;
    const { getEntityName, setEntityName } = useSerializer();
    const name = getEntityName(entity) ?? entity.constructor.name;
    const key = name;

    const onRenameEntity = useCallback(async () => {
        const response = await telescope.request({
            require: false,
            defaultValue: name,
        });
        if (response.type === 'closed') return;

        setEntityName(entity, response.value);
    }, []);

    if (!children.length) return (
        <WithContextMenu className="typography-container">
            <Menu>
                <MenuItem onClick={onRenameEntity}>
                    {t(`Rename ${key}`)}
                </MenuItem>
            </Menu>
            <Typography key={key} style={{ padding: '2px 12px' }}>{name}</Typography>
        </WithContextMenu>
    );

    const details = children.map(
        (entity, i) => <EntityTree key={key + i} entity={entity} />
    );

    return (
        <WithContextMenu>
            <Menu>
                <MenuItem onClick={onRenameEntity}>
                    {t(`Rename ${key}`)}
                </MenuItem>
            </Menu>
            <Accordion key={key}>
                <AccordionSummary slotProps={{
                    button: { style: { paddingTop: 2, paddingBottom: 2 } }
                }}>
                    {entity.constructor.name}
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
}

