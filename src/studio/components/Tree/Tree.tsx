import { observer } from "mobx-react-lite";
import { FC } from "react";
import { RootTree } from "./RootTree";
import { ScenePicker } from "./ScenePicker";
import { activeScene } from "@/studio/stores/active-scene";

export const Tree: FC = observer(() => {
    const { Root: root } = activeScene.realm;

    console.log(root.children);
    const tree = root && <RootTree root={root} />;
    
    return (
        <>
            <ScenePicker />
            {tree}
        </>
    );
});
