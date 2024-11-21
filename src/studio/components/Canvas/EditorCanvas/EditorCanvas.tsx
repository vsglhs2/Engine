import Placeable from "@/engine/base/placeable/base";
import ManualLoop from "@/engine/loop/manual";
import { scene, canvas, context } from "@/studio/stores";
import { PageContainer } from "@/studio/ui";
import { reaction, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { FC, forwardRef, PropsWithChildren, RefObject, useEffect } from "react";
import { Element } from "./Element";

type EditorCanvasProps = PropsWithChildren<{
    loop: ManualLoop;
    ref: RefObject<HTMLDivElement>;
}>;

export const EditorCanvas: FC<EditorCanvasProps> = observer(forwardRef(({ loop, children }, ref) => {
    const { Entities } = scene.realm;

    useEffect(() => {
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
    }, [Entities]);

    useEffect(() => {
        const root = (ref as RefObject<HTMLDivElement>).current;
        if (!root) return;

        return canvas.bindHandlers(root);
    }, [(ref as RefObject<HTMLDivElement>).current, loop]);

    console.log('render');

    const renderedLocked = context.stack
        .filter(entity => entity instanceof Placeable)
        .map((placeable, i) => <Element key={i} placeable={placeable} />);

    return (
        <PageContainer ref={ref}>
            {renderedLocked}
            {children}
        </PageContainer>
    );
}));