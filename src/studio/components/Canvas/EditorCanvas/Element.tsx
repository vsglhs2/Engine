import Placeable from "@/engine/base/placeable/base";
import { useRerender } from "@/studio/hooks";
import { globalSerializer, telescope } from "@/studio/stores";
import { ContextMenu } from "@/studio/ui";
import { Menu, MenuItem, Box } from "@mui/joy";
import { t } from "i18next";
import { reaction, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

type ElementProps = {
    placeable: Placeable;
};

export const Element: FC<ElementProps> = observer(({ placeable }) => {
    const rerender = useRerender();
    const name = globalSerializer.getEntityName(placeable);
    const { globalPosition, size } = placeable;

    const onRenameEntity = async () => {
        const response = await telescope.request({
            require: false,
            defaultValue: name,
        });
        if (response.type === 'closed') return;

        globalSerializer.setEntityName(placeable, response.value);
    };

    const onDeleteEntity = async () => {
        placeable.destroy();
    };

    useEffect(() => reaction(
        () => toJS(placeable),
        () => requestAnimationFrame(rerender), 
        { fireImmediately: true }
    ), []);

    return (
        <ContextMenu>
            <Menu>
                <MenuItem onClick={onRenameEntity}>
                    {t(`Rename`)}
                </MenuItem>
                <MenuItem onClick={onDeleteEntity}>
                    {t(`Delete`)}
                </MenuItem>
            </Menu>
            <Box
                position="absolute"
                top={globalPosition.y}
                left={globalPosition.x}
                width={size.width}
                height={size.height}
                border="1px solid black"
            />
        </ContextMenu>

    );
})