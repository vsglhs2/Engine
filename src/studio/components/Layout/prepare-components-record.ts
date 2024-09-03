import { FunctionComponent } from "react";
import { LayoutConfig } from "./types";
import { Project } from "@/engine/project";

export function prepareComponentsRecord(...rawConfig: LayoutConfig) {
    type ComponentsRecord = Record<string, FunctionComponent<{ project: Project }>>;
    return rawConfig.reduce<ComponentsRecord>((record, row) => {
        row.columns.forEach(({ component }) => record[component.name] = component);

        return record;
    }, {});
}