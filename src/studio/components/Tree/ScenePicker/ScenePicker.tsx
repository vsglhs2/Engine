import { Scene } from "@/engine/scene/scene";
import { projects, scene, telescope } from "@/studio/stores";
import { ContextMenu } from "@/studio/ui";
import { Menu, MenuItem, Option, Select } from "@mui/joy";
import { t } from "i18next";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useEffect, useState } from "react";

export const ScenePicker: FC = observer(() => {
    const project = projects.active!;
    const [sceneName, setSceneName] = useState(() => project.sceneNames()[0]);

    const onChangeScene = (_: unknown, value: string | null) => {
        if (!value || !project.scene(value)) return;
        setSceneName(value);

        scene.activate(project.scene(value)!);
    }

    const onCreateScene = useCallback(async () => {
        const response = await telescope.request();
        if (response.type === 'closed') return;
        
        const scene = new Scene(response.value);
        project.addScene(scene);
    }, []);

    const onDeleteScene = useCallback(async () => {
        const response = await telescope.request();
        if (response.type === 'closed') return;
        
        const scene = new Scene(response.value);
        project.addScene(scene);
    }, []);

    const onRenameScene = useCallback(async () => {}, []);

    useEffect(() => scene.activate(project.scene(sceneName)!), []);

    return (
        <ContextMenu>
            <Menu>
                <MenuItem onClick={onCreateScene}>
                    {t(`Create new scene`)}
                </MenuItem>
                <MenuItem onClick={onDeleteScene}>
                    {t(`Rename scene`)}
                </MenuItem>
                <MenuItem onClick={onRenameScene}>
                    {t(`Delete scene`)}
                </MenuItem>
            </Menu>
            <Select
                value={sceneName}
                onChange={onChangeScene}
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
        </ContextMenu>
    )
});