import { FunctionComponent } from "react";
import { TableConfig } from "./types";

export function prepareComponentsRecord(...rawConfig: TableConfig) {
    return rawConfig.reduce<Record<string, FunctionComponent>>((record, row) => {
        row.columns.forEach(({ component }) => record[component.name] = component);

        return record;
    }, {});
}