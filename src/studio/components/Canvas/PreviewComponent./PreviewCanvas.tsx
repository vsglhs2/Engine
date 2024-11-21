import { PageContainer } from "@/studio/ui";
import { observer } from "mobx-react-lite";
import { FC, forwardRef, PropsWithChildren, RefObject, useEffect } from "react";
import Loop from "@/engine/loop/main";
import './PreviewCanvas.Module.scss';

type PreviewCanvasProps = PropsWithChildren<{
    loop: Loop;
    ref: RefObject<HTMLDivElement>;
}>;

export const PreviewCanvas: FC<PreviewCanvasProps> = observer(forwardRef(({ loop, children }, ref) => {
    useEffect(() => {
        loop.start();

        return () => {
            // TODO: must do loop.destroy() here instead
            loop.stop();
        };
    }, [loop]);

    return (
        <PageContainer ref={ref} className="preview-canvas">
            {children}
        </PageContainer>
    );
}));