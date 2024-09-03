import { FunctionComponent } from "react";

export type LayoutColumn = {
    component: FunctionComponent<Record<string, unknown>>;
    name: string;
    width: number;
};

export type LayoutRow = {
    columns: LayoutColumn[];
    height: number;
};

export type LayoutConfig = LayoutRow[];