import { topBar, TopBar } from "@/studio/stores";
import { Menu } from "@mui/joy";
import { observer } from "mobx-react-lite";
import { FC, KeyboardEvent } from "react";
import { MenuBarButton } from "./MenuBarButton";
import { TopBarElement } from "./TopBarElement";

type TopBarMenuProps = {
    open: boolean;
    element: TopBar.Menu;
    onOpen: () => void;
    onClose: () => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onMouseEnter: () => void;
    onRef: (node: HTMLButtonElement | null) => void;
};

export const TopBarMenu: FC<TopBarMenuProps> = observer(({
    open,
    element,
    onOpen,
    onClose,
    onKeyDown,
    onMouseEnter,
    onRef,
}) => {
    const renderedElements = element.items.map((item, i)  => (
        <TopBarElement key={item.id} element={item} navigationIndex={i} />
    ));

    return (
        <MenuBarButton
            open={open}
            onOpen={onOpen}
            onKeyDown={onKeyDown}
            onMouseEnter={onMouseEnter}
            ref={onRef}
            menu={
                <Menu onClose={onClose}>
                    {renderedElements}
                </Menu>
            }
        >
            {element.title}
        </MenuBarButton>
    );
});