import Placeable from "@/engine/base/placeable/base";
import CaptureController from "@/engine/controller/capture";
import ManualLoop from "@/engine/loop/manual";
import Size from "@/engine/primitives/size";
import MountableRenderer from "@/engine/render/renderer/mountable";
import { scene, canvas, context, projects, topBar } from "@/studio/stores";
import { PageContainer } from "@/studio/ui";
import { reaction, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Element } from "./Element";
import Loop from "@/engine/loop/main";
import BaseLoop from "@/engine/loop/base";
import { flushSync } from "react-dom";

export const Canvas: FC = observer(() => {
    const rootRef = useRef<HTMLDivElement>(null);
    const { environment } = projects.active!;
    const { Entities } = scene.realm;

    // TODO: перенести повыше по компонентам
    const [loop, setLoop] = useState<BaseLoop>(() => new ManualLoop({
        controller: new CaptureController(),
        renderers: environment.renderers,
        entities: Entities,
    }));

    useEffect(() => {
        return topBar.subscribe('preview', () => {
            console.log('preview');
            const loop = new Loop({
                controller: new CaptureController(),
                renderers: environment.renderers,
                entities: Entities,
                fps: 60,
            });

            flushSync(() => setLoop(loop));
            loop.start();
        });
    }, []);

    useEffect(() => {
        return topBar.subscribe('stop', () => {
            console.log('stop');

            setLoop(loop => loop.stop());

            const newLoop = new ManualLoop({
                controller: new CaptureController(),
                renderers: environment.renderers,
                entities: Entities,
            });

            setLoop(newLoop);
        });
    }, []);

    useEffect(() => {
        const root = rootRef.current;
        invariant(root);

        const mountables = environment.renderers.filter(
            renderer => renderer instanceof MountableRenderer
        );

        const cleanUps = mountables.map(mountable => mountable.mount(root));
        if ('sync' in loop ) loop.sync();

        const handler = () => {
            const { clientWidth, clientHeight } = root;

            mountables.forEach(mountable => {
                mountable.resize(new Size(clientWidth, clientHeight))
            });

            if ('sync' in loop ) loop.sync();
        };

        handler();

        window.addEventListener('resize', handler);
        cleanUps.push(() => window.removeEventListener('resize', handler));

        return () => cleanUps.forEach(cleanUp => cleanUp());
    }, [environment, scene.scene, loop]);

    useEffect(() => {
        if (!(loop instanceof ManualLoop)) return;

        console.log('changed Entities');
        return reaction(() => {
            toJS(Entities);
            toJS(context);
            toJS(canvas);
            console.log('her');
        }, () => {

            requestAnimationFrame(() => {
                loop.sync();
            });

            console.log('synced')
        }, { fireImmediately: true, equals: () => false });
    }, [Entities, loop]);

    useEffect(() => {
        const root = rootRef.current;
        invariant(root);

        return canvas.bindHandlers(root);
    }, [scene.realm, scene.scene]);

    console.log('render');

    const renderedLocked = context.stack
        .filter(entity => entity instanceof Placeable)
        .map((placeable, i) => <Element key={i} placeable={placeable} />);

    return (
        <PageContainer ref={rootRef}>
            {renderedLocked}
        </PageContainer>
    );
});