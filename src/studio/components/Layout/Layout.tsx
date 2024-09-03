import { TabNode, Model, Layout as FlexLayout } from "flexlayout-react";
import { FC, useMemo, createElement } from "react";
import { createJsonModel } from "./create-json-model";
import { prepareComponentsRecord } from "./prepare-components-record";
import { LayoutConfig } from "./types";
import { Project } from "@/engine/project";

type LayoutProps = {
    config: LayoutConfig;
    project: Project;
};

// TODO: сделать запоминание текущего layout'а

export const Layout: FC<LayoutProps> = ({
    config,
    project,
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
    
            return createElement(Component, {
                project,
            });
        }

        return [Model.fromJson(jsonModel), factory] as const;
    }, [config]);

    // const onModelChange = (model: Model) => {
    //     const string = model.toString();
    // };

    return (
        <FlexLayout
            model={model}
            factory={factory}
            realtimeResize
        />
    )
};