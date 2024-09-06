import Entity from "@/engine/entity/entity";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Menu, MenuItem, Typography, VariantProp } from "@mui/joy";
import { FC, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import './Tree.Module.scss';
import { ContextMenu } from "@/studio/ui";
import { globalSerializer, telescope, tree, explorer } from "@/studio/stores";
import { t } from "i18next";
import { observer } from "mobx-react-lite";
import { EntityDerived } from "@/engine/decorators";
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import invariant from "tiny-invariant";
import classNames from "classnames";
import { createRoot } from "react-dom/client";

type EntityTreeProps = {
    entity: Entity;
};

// TODO: Do tree virtualization and proper memoization
// TODO: decompose

export const EntityTree: FC<EntityTreeProps> = observer(({ entity }) => {
    const { children } = entity;
    const name = globalSerializer.getEntityName(entity);
    const expanded = tree.getExpanded(entity);
    const selected = explorer.getEntityIndex(entity) !== -1;
    const draggableRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggedOver, setIsDraggedOver] = useState(false);

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
        tree.setExpanded(entity, true);
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

    const onExpand = useCallback((e: MouseEvent) => {
        tree.toggleExpanded(entity);

        e.stopPropagation();
    }, [entity]);

    const onSelect = useCallback(() => explorer.putEntity(entity), [entity]);

    useEffect(() => {
        const draggableElement = draggableRef.current;
        invariant(draggableElement);

        const targetElement = targetRef.current;
        invariant(targetElement);

        return combine(
            draggable({
                element: draggableElement,
                getInitialData(args) {
                    return {
                        entity,
                    };
                },
                onGenerateDragPreview({ nativeSetDragImage }) {
                    setCustomNativeDragPreview({
                        render({ container, }) {
                            const root = createRoot(container);
                            root.render(<div>{name}</div>);

                            return () => root.unmount();
                        },
                        getOffset: pointerOutsideOfPreview({
                            x: '16px',
                            y: '16px',
                        }),
                        nativeSetDragImage,
                    })
                },
                onDragStart(args) {
                    setIsDragging(true);
                },
                onDrop(args) {
                    setIsDragging(false);
                },
            }),
            dropTargetForElements({
                element: targetElement,
                getData(args) {
                    return {
                        type: 'current',
                        entity,
                    };
                },
                onDragEnter(args) {
                    setIsDraggedOver(true);
                },
                onDragLeave(args) {
                    setIsDraggedOver(false);
                },
                onDrop(args) {
                    setIsDraggedOver(false);
                },
            })
        );
    }, []);

    const details = children.map(
        (entity, i) => <EntityTree key={name + i} entity={entity} />
    );

    const renderTree = Boolean(children.length);
    const className = classNames(renderTree ? undefined : 'typography-container');
    const variant: VariantProp | undefined = isDraggedOver
        ? 'outlined'
            : selected ? 'soft' : undefined;

    const rendered = renderTree ? (
        <Accordion
            expanded={expanded}
            ref={draggableRef}
        >
            <AccordionSummary 
                variant={variant}
                className={classNames(isDragging && 'dragging')}
                slotProps={{
                    button: { style: { paddingTop: 2, paddingBottom: 2 } },
                    indicator: { onClick: onExpand, style: { display: 'flex', alignItems: 'center', height: '100%' } }
                }}
                onDoubleClick={onExpand}
                onClick={onSelect}
            >
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
    ) : (
        <Typography
            onDragStart={console.log}
            onClick={onSelect} 
            variant={variant} 
            sx={{ padding: '2px 12px', userSelect: 'none' }}
             ref={draggableRef}
        >
            {name}
        </Typography>
    );

    return (
        <> 
            <ContextMenu className={className} ref={targetRef}>
                <Menu>
                    <MenuItem onClick={onCreateEntity}>
                        {t(`Create entity`)}
                    </MenuItem>
                    <MenuItem onClick={onRenameEntity}>
                        {t(`Rename`)}
                    </MenuItem>
                    <MenuItem onClick={onDeleteEntity}>
                        {t(`Delete`)}
                    </MenuItem>
                </Menu>
                {rendered}
            </ContextMenu>
        </>

    );
});

