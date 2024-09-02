import { TabNode, Model, Layout as FlexLayout } from "flexlayout-react";
import { FC, useMemo, createElement } from "react";
import { createJsonModel } from "./create-json-model";
import { prepareComponentsRecord } from "./prepare-components-record";
import { TableConfig } from "./types";

type LayoutProps = {
    config: TableConfig;
};

export const Layout: FC<LayoutProps> = ({
    config,
}) => {
    const [model, factory] = useMemo(() => {
        const jsonModel = createJsonModel(...config);
        const components = prepareComponentsRecord(...config);

        const factory = (node: TabNode) => {
            const componentName = node.getComponent();
            if (!componentName)
                throw new Error(`There is no [${componentName}] in provided config`);
    
            const Component = components[componentName];
            if (!Component)
                throw new Error(`There is no [${componentName}] in prepared record`);
    
            return createElement(Component);
        }

        return [Model.fromJson(jsonModel), factory] as const;
    }, [config]);

    return (
        <FlexLayout
            model={model}
            factory={factory}
            realtimeResize
        />
    )
};