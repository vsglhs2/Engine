import { topbar, TopBar } from "@/studio/stores";
import { ListDivider, ListItem, List, MenuItem } from "@mui/joy";
import { FC, ReactNode } from "react";
import { TopBarMenu } from "./TopBarMenu";
import { observer } from "mobx-react-lite";

type TopBarElementProps = {
    element: TopBar.Element;
    navigationIndex: number;
};

export const TopBarElement: FC<TopBarElementProps> = observer(({
    element,
    navigationIndex
}) => {
    const itemProps = {
        onClick: () => {
            topbar.menuIndex = null;
            topbar.dispatch(element.id);
        },
        onKeyDown: topbar.handleKeyDown,
    };

    let renderedItem: ReactNode;

    switch (element.type) {
        case TopBar.ElementType.Menu: renderedItem = (
            <TopBarMenu
                element={element}
                open={topbar.menuIndex === navigationIndex}
                onOpen={() => {
                    topbar.menuIndex = topbar.menuIndex === null ? navigationIndex : null;
                }}
                onClose={() => {
                    topbar.menus.current[navigationIndex]?.focus();
                }}
                onKeyDown={topbar.createHandleButtonKeyDown(navigationIndex)}
                onMouseEnter={() => {
                    if (typeof topbar.menuIndex === 'number') {
                        topbar.menuIndex = navigationIndex;
                    }
                }}
                onRef={(node) => {
                    topbar.menus.current[navigationIndex] = node!;
                }}
            />
        ); break;
        case TopBar.ElementType.Divider: renderedItem = (
            <ListDivider />
        ); break;
        case TopBar.ElementType.Item: renderedItem = (
            <ListItem nested>
                <List>
                    <MenuItem {...itemProps}>{element.title}</MenuItem>
                </List>
            </ListItem>
        ); break;
    }
    return (
        <ListItem>
            {renderedItem}
        </ListItem>
    );
});