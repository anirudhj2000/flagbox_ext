import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export const Popover = ({ children, ref }: { children: React.ReactNode; ref: React.RefObject<HTMLElement> }) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && popoverRef.current) {
            const { top, left, width, height } = ref.current.getBoundingClientRect();
            popoverRef.current.style.top = `${top + height + 4}px`;
            popoverRef.current.style.left = `${left}px`;
            popoverRef.current.style.width = `${width}px`;
        }
    }, [ref]);

    return createPortal(
        <div ref={popoverRef} className="popover">
            {children}
        </div>,
        document.body
    );
};


