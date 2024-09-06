import Entity from "@/engine/entity/entity";
import { activeScene, globalSerializer, telescope } from "@/studio/stores";
import { ConverterProps } from "@/studio/stores/converter";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Box, Typography } from "@mui/joy";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

export const ObjectConverter: FC<ConverterProps<Entity, typeof Entity>> = observer(({ store }) => {
    const name = globalSerializer.getEntityName(store.value);
    const ref = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    const onClick = async () => {
        const entities = Array.from(activeScene.realm.Entities.entities.keys());
        const options = entities
            .filter(entity => entity instanceof store.as)
            .map(entity => globalSerializer.getEntityName(entity));
        const response = await telescope.request({
            defaultValue: name,
            require: true,
            options: options,
            validator: store.as,
        });

        if (response.type === 'closed') return;
        console.log(response.option);
    };

    useEffect(() => {
        const element = ref.current;
        invariant(element);

        return dropTargetForElements({
            element,
            getData(args) {
                return {
                    type: 'assign',
                    entity: store.entity,
                    key: store.key,
                    as: store.as,
                };
            },
            onDragEnter(args) {
                setIsHovering(true);
            },
            onDragLeave(args) {
                setIsHovering(false);
            },
            onDrop(args) {
                console.log('drop', args);
                setIsHovering(false);
            },
        })
    }, []);

    return (
        <Box display="flex" flexDirection="column" sx={{
            backgroundColor: isHovering ? 'lightblue' : undefined
        }} gap={2} ref={ref}>
            <Typography onClick={onClick}>{name}</Typography>
        </Box>
    );
});