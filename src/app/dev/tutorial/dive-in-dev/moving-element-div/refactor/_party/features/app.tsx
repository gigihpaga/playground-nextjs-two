'use client';

import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { Parent as ParentBox, Child as ChildBox } from '@/app/dev/tutorial/dive-in-dev/moving-element-div/_party/components/box';
import { cards, type Card } from '@/app/dev/tutorial/dive-in-dev/moving-element-div/_party/data/card';
import { cn } from '@/lib/classnames';

type Coordinate = {
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
};

export function App() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [data, setData] = useState<Card[]>(cards);

    return (
        <ParentBox
            ref={containerRef}
            aria-description="parrent"
            className="bg-green-800"
        >
            <ChildBox className="h-[100px] w-[15px] top-0 left-0 bg-orange-500" />
            {data.map((d) => (
                <Children
                    key={d.text}
                    data={d}
                    containerRef={containerRef}
                />
            ))}
        </ParentBox>
    );
}

type ChildrenProps = {
    containerRef: MutableRefObject<HTMLDivElement | null>;
    data: Card;
};

function Children({ containerRef, data }: ChildrenProps) {
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
            box.style.cursor = 'grabbing';
        }
        function onMouseUp(event: MouseEvent) {
            isClicked.current = false;
            coords.current.lastX = box.offsetLeft;
            coords.current.lastY = box.offsetTop;
            box.style.cursor = 'grab';
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

            console.table({
                startX: coords.current.startX,
                startY: coords.current.startY,
                lastX: coords.current.lastX,
                lastY: coords.current.lastY,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ChildBox
            ref={boxRef}
            aria-description="child"
            className={cn('bg-yellow-400', data.color, isClicked.current && 'cursor-grabbing')}
        >
            {data.text}
        </ChildBox>
    );
}
