import { createElement, FC, useEffect, useRef, useState } from "react";
import { EditorCanvas } from "./EditorCanvas/EditorCanvas";
import ManualLoop from "@/engine/loop/manual";
import Loop from "@/engine/loop/main";
import { observer } from "mobx-react-lite";
import { CanvasMode, studio } from "@/studio/stores/studio";
import { canvas, projects, scene } from "@/studio/stores";
import CaptureController from "@/engine/controller/capture";
import { PreviewCanvas } from "./PreviewComponent./PreviewCanvas";
import MountableRenderer from "@/engine/render/renderer/mountable";
import Size from "@/engine/primitives/size";
import EmptyController from "@/engine/controller/empty";
import { PreviewIndicator } from "./PreviewComponent.";

export const Canvas: FC = observer(() => {
    const [loop, setLoop] = useState<ManualLoop | Loop | null>(null); 
    const rootRef = useRef<HTMLDivElement>(null);  

    const { canvasMode } = studio;
    const { environment } = projects.active!;
    const { Entities } = scene.realm;

    useEffect(() => {
        let loop: ManualLoop | Loop | null = null;
        const loopConfiguration = {
            entities: Entities,
            renderers: environment.renderers,
        };

        switch (canvasMode) {
            case CanvasMode.PREVIEW_PAUSE:
            case CanvasMode.EDITOR: loop = new ManualLoop({
                ...loopConfiguration,
                controller: new EmptyController(),
            }); break;
            case CanvasMode.PREVIEW_PLAY: loop = new Loop({
                ...loopConfiguration,
                // TODO: pass root here
                controller: new CaptureController(),
                fps: 60,
            }); break;
        }

        setLoop(loop);

        return () => {
            if (!loop) return;

            loop.destroy();
        };
    }, [canvasMode]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const mountables = environment.renderers.filter(
            renderer => renderer instanceof MountableRenderer
        );

        const cleanUps = mountables.map(mountable => mountable.mount(root));

        const handler = () => {
            const { clientWidth, clientHeight } = root;

            mountables.forEach(mountable => {
                mountable.resize(new Size(clientWidth, clientHeight));
            });

            // REDO
            if (loop instanceof ManualLoop) loop.sync();
        };

        handler();

        console.log('mounted', mountables);

        window.addEventListener('resize', handler);
        cleanUps.push(() => window.removeEventListener('resize', handler));

        return () => cleanUps.forEach(cleanUp => cleanUp());
    }, [environment, scene.scene, rootRef.current, loop]);

    const shouldRenderCanvas = (
        ([CanvasMode.PREVIEW_PAUSE, CanvasMode.EDITOR].includes(canvasMode)) &&
        loop instanceof ManualLoop
    ) || (
        canvasMode === CanvasMode.PREVIEW_PLAY  && 
        loop instanceof Loop
    );

    if (!shouldRenderCanvas) return null;

    const CanvasComponent = canvasMode === CanvasMode.PREVIEW_PLAY
        ? PreviewCanvas
        : EditorCanvas;
    
    return (
        <CanvasComponent ref={rootRef} loop={loop}>
            { studio.canvasMode !== CanvasMode.EDITOR && (<PreviewIndicator />) }
        </CanvasComponent>
    )
});