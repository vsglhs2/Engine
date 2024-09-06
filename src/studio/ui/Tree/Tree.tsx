import { observer } from "mobx-react-lite";
import { FC } from "react";

export type TreeItemConfig = {
    children: TreeItemConfig[];
}

export type TreeRootConfig = {
    children: TreeItemConfig[];
};

export type TreeProps = {
    root: TreeRootConfig;
};

export const Tree: FC<TreeProps> = observer(({}) => {
    // Перенести переделанный вариант дерева из @atlaskit pragmatic dnd примера
});