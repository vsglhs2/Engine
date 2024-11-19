import { topBar, TopBar } from "@/studio/stores";
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
            topBar.menuIndex = null;
            topBar.dispatch(element.id);
        },
        onKeyDown: topBar.handleKeyDown,
    };

    let renderedItem: ReactNode;

    switch (element.type) {
        case TopBar.ElementType.Menu: renderedItem = (
            <TopBarMenu
                element={element}
                open={topBar.menuIndex === navigationIndex}
                onOpen={() => {
                    topBar.menuIndex = topBar.menuIndex === null ? navigationIndex : null;
                }}
                onClose={() => {
                    topBar.menus.current[navigationIndex]?.focus();
                }}
                onKeyDown={topBar.createHandleButtonKeyDown(navigationIndex)}
                onMouseEnter={() => {
                    if (typeof topBar.menuIndex === 'number') {
                        topBar.menuIndex = navigationIndex;
                    }
                }}
                onRef={(node) => {
                    topBar.menus.current[navigationIndex] = node!;
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