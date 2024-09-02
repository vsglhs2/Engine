import { FunctionComponent } from "react";

export type TableColumn<
    Component extends FunctionComponent<Record<string, unknown>>
    = FunctionComponent<Record<string, unknown>>
> = {
    component: Component;
    width: number;
};

export type TableRow = {
    columns: TableColumn[];
    height: number;
};

export type TableConfig = TableRow[];