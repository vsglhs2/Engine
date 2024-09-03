import { useMemo } from "react";
import { Tree, Canvas, Explorer } from "../../components";
import { row, col } from "../../components/Layout";

// TODO: use mobx for handling config

export function useStudioConfig() {
    return useMemo(() => [
        row(
            col(Tree),
            col(Canvas, 2),
            col(Explorer),
        ),
    ], []);
}