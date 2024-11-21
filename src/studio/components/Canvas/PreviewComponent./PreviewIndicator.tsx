import { topbar } from "@/studio/stores";
import { CanvasMode, studio } from "@/studio/stores/studio";
import { Pause, PlayArrow, StopSharp } from "@mui/icons-material";
import { Stack } from "@mui/joy";
import { observer } from "mobx-react-lite";
import { createElement, FC } from "react";

type PreviewIndicatorProps = {
};

export const PreviewIndicator: FC<PreviewIndicatorProps> = observer(() => {
    const isPlaying = studio.canvasMode === CanvasMode.PREVIEW_PLAY;

    const onClick = () => {
        studio.canvasMode = isPlaying
            ? CanvasMode.PREVIEW_PAUSE
            : CanvasMode.PREVIEW_PLAY;
    };

    const onStop = () => {
        topbar.dispatch('stop');
    };

    const StateIcon = !isPlaying ? PlayArrow : Pause;
    const renderedStateIcon = createElement(StateIcon, {
        onClick,
    });
    
    return (
        <Stack direction="row" gap={2} className="preview-indicator">
            {renderedStateIcon}
            <StopSharp onClick={onStop} />
        </Stack>
    );
});