import { useCallback, useEffect, useMemo, useRef } from "react"

type MousePosition = {
    clientX: number;
    clientY: number;
};

const defaultPosition: MousePosition = {
    clientX: 0,
    clientY: 0,
};

// export function useMousePosition(delay = 0) {
//     const [position, setPosition] = useState(defaultPosition);

//     useEffect(() => {
//         const handler = throttle((e: MouseEvent) => {
//             const newPosition: MousePosition = {
//                 clientX: e.clientX,
//                 clientY: e.clientY,
//             };

//             setPosition(newPosition);
//         }, delay);

//         document.addEventListener('mousemove', handler);
//         return () => document.removeEventListener('mousemove', handler);

//     }, []);

//     return position;
// }

export function useMousePosition(deps: unknown[]) {
    const positionRef = useRef(defaultPosition);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            positionRef.current.clientX = e.clientX;
            positionRef.current.clientY = e.clientY;
        };

        document.addEventListener('mousemove', handler);
        return () => document.removeEventListener('mousemove', handler);

    }, []);

    return useMemo(() => positionRef.current, deps);
}