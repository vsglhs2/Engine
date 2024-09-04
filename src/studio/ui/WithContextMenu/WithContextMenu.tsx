import { Dropdown, MenuButton } from "@mui/joy";
import { FC, useState, useCallback, HTMLAttributes, Children, cloneElement, ReactElement } from "react";
import { OutsideClickHandler } from "../OutsideClickHandler";
import { useMousePosition } from "@/studio/hooks";

type WithContextMenuProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactElement[];
};

// TODO: Сделать возможным рендерить только одно контекстное меню в один момент времени

export const WithContextMenu: FC<WithContextMenuProps> = ({ children, ...props }) => {
    const [open, setOpen] = useState(false);

    const position = useMousePosition([open]);

    const onContextMenu = useCallback((e: React.MouseEvent) => {
        if (e.isDefaultPrevented()) {
            setOpen(false);
            return;
        } 
        
        setOpen(open => !open);
        e.preventDefault();
    }, []);

    const onClickOutside = useCallback(() => setOpen(false), []);
    const onClick = onClickOutside;

    const translate = `translate(${position.clientX}px, ${position.clientY}px) !important`;

    // THINK: лучше сделать более "надежным" способом?
    const [menu, restChildren] = Children.toArray(children);
    const rerenderedMenu = cloneElement(menu as ReactElement, {
        sx: { 
            zIndex: 9999,
            transform: translate,
        }
    });

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
                    {restChildren}
                </MenuButton>
                {rerenderedMenu}
            </Dropdown>
        </OutsideClickHandler>
    );
}