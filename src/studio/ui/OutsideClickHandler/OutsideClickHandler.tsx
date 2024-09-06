import { useOutsideClickHandler } from "@/studio/hooks";
import { forwardRef, useRef } from "react";

type OutsideClickHandlerProps = React.HTMLAttributes<HTMLDivElement> & {
    onClickOutside: (e: MouseEvent) => void;
    onContextMenuOutside: (e: MouseEvent) => void;
};

export const OutsideClickHandler = forwardRef<HTMLDivElement, OutsideClickHandlerProps>(({
    onClickOutside,
    onContextMenuOutside,
    children,
    ...props
}, outerRef) => {
    const handlerRef = useRef<HTMLDivElement | null>(null);
    useOutsideClickHandler(handlerRef, onClickOutside);
    useOutsideClickHandler(handlerRef, onContextMenuOutside, 'contextmenu');

    const onRef = (element: HTMLDivElement | null) => {
        handlerRef.current = element;

        if (typeof outerRef === 'function') return outerRef(element);
        if (!outerRef) return;
        outerRef.current = element;
    }

    return (
        <div {...props} ref={onRef}>
            {children}
        </div>
    );
});
