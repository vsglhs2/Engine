import { FunctionComponent } from "react";

export type LayoutColumn = {
    component: FunctionComponent<Record<string, unknown>>;
    width: number;
};

export type LayoutRow = {
    columns: LayoutColumn[];
    height: number;
};

export type LayoutConfig = LayoutRow[];