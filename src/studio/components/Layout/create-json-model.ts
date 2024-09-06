import { IJsonModel, IJsonRowNode, IJsonTabSetNode } from "flexlayout-react";
import { LayoutConfig } from "./types";

export function createJsonModel(
    ...rawConfig: LayoutConfig
): IJsonModel {
    const rows = rawConfig;

    const children = rows.map<IJsonRowNode>((row) => {
        const columns = row.columns.map<IJsonTabSetNode>(column => ({
            type: "tabset",
            enableTabStrip: false,
            weight: column.width,
            children: [
                {
                    type: "row",
                    component: column.name,
                }
            ]
        }));

        return {
            type: "row",
            weight: row.height,
            children: columns,
        };
    });

    return {
        global: {},
        borders: [],
        layout: {
            type: 'row',
            children: [{
                type: 'row',
                children,
            }]
        }
    };
}