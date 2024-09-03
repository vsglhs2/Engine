import { MenuItem, Dropdown, MenuButton, Menu } from "@mui/joy";
import { PropsWithChildren, FC, useState, useCallback, useMemo, HTMLAttributes } from "react";
import { MenuItemConfig } from "@/studio/utils";
import { OutsideClickHandler } from "../OutsideClickHandler";
import { useMousePosition } from "@/studio/hooks";

type WithContextMenuProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren<{
    items: MenuItemConfig[];
}>;

export const WithContextMenu: FC<WithContextMenuProps> = ({ items, children, ...props }) => {
    const [open, setOpen] = useState(false);

    const position = useMousePosition([open]);

    const onContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(open => !open);
    }, []);

    const onClickOutside = useCallback(() => setOpen(false), []);
    const onClick = onClickOutside;

    const renderedMenuItems = useMemo(() => items.map(item => (
        <MenuItem key={item.label} onClick={item.onClick}>{item.label}</MenuItem>
    )), [items]);

    const translate = `translate(${position.clientX}px, ${position.clientY}px) !important`;

    return (
        <OutsideClickHandler
            {...props}
            onClickOutside={onClickOutside}
            onContextMenuOutside={onClickOutside}
            onContextMenu={onContextMenu}
            onClick={onClick}
        >
            <Dropdown open={open}>
                <MenuButton slots={{
                    root: 'div'
                }}>
                    {children}
                </MenuButton>
                <Menu 
                    sx={{ 
                        zIndex: 9999,
                        transform: translate,
                    }}
                >
                    {renderedMenuItems}
                </Menu>
            </Dropdown>
        </OutsideClickHandler>

    );
}