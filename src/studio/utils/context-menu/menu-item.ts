import { ReactNode } from "react";

export type MenuItemConfig = {
    onClick: () => void;
    label: string;
    icon?: ReactNode;
};

export function menuItem(
    label: string,
    onClick: () => void = () => { },
    icon?: ReactNode
): MenuItemConfig {
    return {
        label,
        onClick,
        icon,
    };
}