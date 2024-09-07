import { observer } from "mobx-react-lite";
import { FC } from "react";
import { RootTree } from "./RootTree";
import { ScenePicker } from "./ScenePicker";
import { scene } from "@/studio/stores";

export const Tree: FC = observer(() => {
    const { Root: root } = scene.realm;

    console.log(root.children);
    const tree = root && <RootTree root={root} />;
    
    return (
        <>
            <ScenePicker />
            {tree}
        </>
    );
});
