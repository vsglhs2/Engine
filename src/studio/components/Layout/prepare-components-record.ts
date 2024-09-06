import { FunctionComponent } from "react";
import { LayoutConfig } from "./types";

export function prepareComponentsRecord(...rawConfig: LayoutConfig) {
    type ComponentsRecord = Record<string, FunctionComponent>;
    return rawConfig.reduce<ComponentsRecord>((record, row) => {
        row.columns.forEach(({ component, name }) => record[name] = component);

        return record;
    }, {});
}