import { Dropdown, MenuButton } from "@mui/joy";
import { useState, useCallback, HTMLAttributes, Children, cloneElement, ReactElement, forwardRef, PropsWithRef } from "react";
import { OutsideClickHandler } from "../OutsideClickHandler";
import { useMousePosition } from "@/studio/hooks";

type ContextMenuProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactElement[];
};

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(({ 
    children,
    ...props 
}, ref) => {
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
            ref={ref}
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
});