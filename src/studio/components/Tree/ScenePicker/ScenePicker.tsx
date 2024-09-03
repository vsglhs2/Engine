import { Scene } from "@/engine/scene/scene";
import { projects, activeScene, telescope } from "@/studio/stores";
import { WithContextMenu } from "@/studio/ui";
import { menuItem } from "@/studio/utils";
import { Option, Select } from "@mui/joy";
import { t } from "i18next";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useMemo, useState } from "react";

export const ScenePicker: FC = observer(() => {
    const project = projects.active!;
    const [sceneName, setSceneName] = useState(() => project.sceneNames()[0]);

    const onSceneChange = (_: unknown, value: string | null) => {
        if (!value || !project.scene(value)) return;
        setSceneName(value);

        activeScene.activate(project.scene(value)!);
    }

    const menuItems = useMemo(() => [
        menuItem(t('Create new scene'), async () => {
            const response = await telescope.request();
            if (response.type === 'closed') return;
            
            const scene = new Scene(response.value);
            project.addScene(scene);
        }),
        menuItem(t('Delete scene'), () => {

        }),
        menuItem(t('Rename scene')),
    ], [t]);

    useEffect(() => activeScene.activate(project.scene(sceneName)!), []);

    return (
        <WithContextMenu items={menuItems}>
            <Select
                value={sceneName}
                onChange={onSceneChange}
                style={{ zIndex: 100 }}
            >
                {project.scenes().map(scene => (
                    <Option
                        key={scene.name}
                        value={scene.name}
                    >
                        {scene.name}
                    </Option>
                ))}
            </Select>
        </WithContextMenu>
    )
});