
import { DropdownProps, Dropdown, MenuButton, ListItemButton, menuItemClasses, typographyClasses, Theme } from "@mui/joy";
import { KeyboardEventHandler, MouseEventHandler, forwardRef, ForwardedRef, cloneElement } from "react";

type MenuBarButtonProps = Pick<DropdownProps, 'children' | 'open'> & {
    onOpen: DropdownProps['onOpenChange'];
    onKeyDown: KeyboardEventHandler;
    menu: JSX.Element;
    onMouseEnter: MouseEventHandler;
};

export const MenuBarButton = forwardRef((
    _props: MenuBarButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
) => {
    const { children, menu, open, onOpen, onKeyDown, ...props } = _props;

    return (
        <Dropdown open={open} onOpenChange={onOpen}>
            <MenuButton
                {...props}
                slots={{ root: ListItemButton }}
                ref={ref}
                role="menuitem"
                variant={open ? 'soft' : 'plain'}
            >
                {children}
            </MenuButton>
            {cloneElement(menu, {
                slotProps: {
                    listbox: {
                        id: `toolbar-example-menu-${children}`,
                        'aria-label': children,
                    },
                },
                placement: 'bottom-start',
                disablePortal: false,
                variant: 'soft',
                sx: (theme: Theme) => ({
                    width: 288,
                    boxShadow: '0 2px 8px 0px rgba(0 0 0 / 0.38)',
                    '--List-padding': 'var(--ListDivider-gap)',
                    '--ListItem-minHeight': '32px',
                    [`&& .${menuItemClasses.root}`]: {
                        transition: 'none',
                        '&:hover': {
                            ...theme.variants.solid.primary,
                            [`& .${typographyClasses.root}`]: {
                                color: 'inherit',
                            },
                        },
                    },
                }),
            })}
        </Dropdown>
    );
},
);
