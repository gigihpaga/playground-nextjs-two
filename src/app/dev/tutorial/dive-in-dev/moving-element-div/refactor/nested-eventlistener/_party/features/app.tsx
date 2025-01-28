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
            className="bg-orange-800"
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

    useEffect(() => {
        if (!containerRef.current || !boxRef.current) return;

        const container = containerRef.current;
        const box = boxRef.current;

        function onMouseDown(event: MouseEvent) {
            box.style.cursor = 'grabbing';
            box.addEventListener('mousemove', onMouseMove);
        }
        function onMouseUp(event: MouseEvent) {
            box.style.cursor = 'grab';
            box.removeEventListener('mousemove', onMouseMove);
        }
        function onMouseMove(event: MouseEvent) {
            const style = window.getComputedStyle(box);
            const left = parseInt(style.left), // "50px" menjadi 50
                top = parseInt(style.top);

            const mouseX = event.movementX,
                mouseY = event.movementY;

            box.style.left = `${left + mouseX}px`;
            box.style.top = `${top + mouseY}px`;
        }

        box.addEventListener('mousedown', onMouseDown);
        container.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mouseleave', onMouseUp);

        const cleanup = () => {
            box.removeEventListener('mousedown', onMouseDown);
            box.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseup', onMouseUp);
            container.removeEventListener('mouseleave', onMouseUp);
        };

        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ChildBox
            ref={boxRef}
            aria-description="child"
            className={cn('bg-yellow-400', data.color)}
        >
            {data.text}
        </ChildBox>
    );
}
