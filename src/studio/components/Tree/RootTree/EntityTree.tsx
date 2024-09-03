import Entity from "@/engine/entity/entity";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Typography } from "@mui/joy";
import { FC } from "react";
import './Tree.Module.scss';
import { WithContextMenu } from "@/studio/ui";
import { menuItem } from "@/studio/utils";
import { telescope } from "@/studio/stores";
import { useSerializer } from "@/studio/hooks";

type EntityTreeProps = {
    entity: Entity;
};

// Do tree virtualization

export const EntityTree: FC<EntityTreeProps> = ({ entity }) => {
    const { children } = entity;
    const { getEntityName, setEntityName } = useSerializer();
    const name = getEntityName(entity) ?? entity.constructor.name;
    const key = name;

    if (!children.length) return (
        <div className="typography-container">
            <Typography key={key} style={{ padding: '2px 12px' }}>{name}</Typography>
        </div>
    );

    const details = children.map(
        (entity, i) => <EntityTree key={key + i} entity={entity} />
    );

    return (
        <WithContextMenu items={[menuItem('Rename ' + key, async () => {
            const response = await telescope.request();
            if (response.type === 'closed') return;

            const name = response.value;
            setEntityName(entity, name);

        })]}>
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

