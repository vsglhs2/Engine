import { FunctionComponent } from "react";
import { LayoutColumn, LayoutRow } from "./types";

// THINK: maybe move it to utils ?
// TODO: do better with types
type RowOptions = Record<string, unknown>;
type RowArgs = (LayoutColumn | number | RowOptions)[];

export function row(...args: RowArgs): LayoutRow {
    const heightIndex = args.findIndex(arg => typeof arg === 'number');
    const [height, options] = heightIndex !== -1
        ? args.slice(heightIndex) as [number, Record<string, unknown>]
        : [1, {}] as const; // defaults

    const columnsEndIndex = heightIndex === -1 ? undefined : heightIndex;
    const columns = args.slice(0, columnsEndIndex) as LayoutColumn[];

    return {
        height,
        columns,
    };
}

export function col(component: FunctionComponent, width = 1, options = {}): LayoutColumn {
    return {
        component,
        width,
    };
}
