import { FC, useMemo } from "react";
import { Canvas, Explorer, Layout, TopBar, Tree } from "../../components";
import './Studio.Module.scss';
import { col, row } from "../../components/Layout";

export const Studio: FC = () => {
    const config = useMemo(() => [
        row(
            col(Tree),
            col(Canvas, 2),
            col(Explorer),
        ),
    ], []);

    return (
        <>
            <TopBar />
            <Layout config={config} />
        </>
    )
};