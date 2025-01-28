'use client';

import { useEffect, useRef, useState } from 'react';
import { Parent, Child } from '@/app/dev/tutorial/dive-in-dev/moving-element-div/_party/components/box';

type Coordinate = {
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
};

export function App() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const boxRef = useRef<HTMLDivElement | null>(null);

    let isClicked = useRef<boolean>(false);
    let coords = useRef<Coordinate>({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
    });

    useEffect(() => {
        if (!containerRef.current || !boxRef.current) return;

        const container = containerRef.current;
        const box = boxRef.current;

        function onMouseDown(event: MouseEvent) {
            isClicked.current = true;
            const style = getComputedStyle(box);
            coords.current.startX = event.clientX;
            coords.current.startY = event.clientY;
        }
        function onMouseUp(event: MouseEvent) {
            isClicked.current = false;
            coords.current.lastX = box.offsetLeft;
            coords.current.lastY = box.offsetTop;
        }
        function onMouseMove(event: MouseEvent) {
            if (!isClicked.current) return;
            const {
                //
                clientX, // relativ viewport
                clientY,
                offsetX, // relative element
                offsetY,
                pageX, // relative website page
                pageY,
                screenX, // relative layar laptop
                screenY,
                x,
                y,
                movementX,
                movementY,
            } = event;
            console.table({
                clientX,
                offsetX,
                pageX,
                screenX,
                x,
                movementX,
            });

            const nextX = clientX - coords.current.startX + coords.current.lastX,
                nextY = clientY - coords.current.startY + coords.current.lastY;

            box.style.top = `${nextY}px`;
            box.style.left = `${nextX}px`;
        }

        box.addEventListener('mousedown', onMouseDown);
        box.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseleave', onMouseUp);

        const cleanup = () => {
            box.removeEventListener('mousedown', onMouseDown);
            box.removeEventListener('mouseup', onMouseUp);
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseleave', onMouseUp);
        };

        return cleanup;
    }, []);

    return (
        <Parent
            ref={containerRef}
            aria-description="parrent"
            className="bg-fuchsia-800 h-[calc(75vh)] p-8 relative"
        >
            <Child
                ref={boxRef}
                aria-description="child"
                className="absolute h-[50px] w-[50px] bg-fuchsia-600 top-0 left-0 select-none cursor-grab"
            >
                app
            </Child>
        </Parent>
    );
}
