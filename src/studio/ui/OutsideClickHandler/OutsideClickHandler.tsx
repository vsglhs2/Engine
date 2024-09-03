import { useOutsideClickHandler } from "@/studio/hooks";
import { FC, useRef } from "react";

type OutsideClickHandlerProps = React.HTMLAttributes<HTMLDivElement> & {
    onClickOutside: (e: MouseEvent) => void;
    onContextMenuOutside: (e: MouseEvent) => void;
};

export const OutsideClickHandler: FC<OutsideClickHandlerProps> = ({
    onClickOutside,
    onContextMenuOutside,
    children,
    ...props
}) => {
    const ref = useRef<HTMLDivElement>(null);
    useOutsideClickHandler(ref, onClickOutside);
    useOutsideClickHandler(ref, onContextMenuOutside, 'contextmenu');

    return (
        <div {...props} ref={ref}>
            {children}
        </div>
    );
}
