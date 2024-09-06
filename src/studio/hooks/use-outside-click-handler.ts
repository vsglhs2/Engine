import { useEffect } from "react";

export function useOutsideClickHandler(
    ref: React.RefObject<HTMLElement>,
    handler: (e: MouseEvent) => void,
    type: 'click' | 'contextmenu' | 'dblclick' = 'click'
) {
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!ref.current) return;
            if (e.target instanceof Element && ref.current.contains(e.target))
                return;

            handler(e);
        };

        document.addEventListener(type, onClick);
        return () => document.removeEventListener(type, onClick);
    }, [handler, type]);
}