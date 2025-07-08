'use client';
import React, { useCallback, useEffect } from 'react';
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

type DndContextProps = React.ComponentProps<typeof DndContext>;

type DraggableWrapperProps = {
    /** @default 2 */
    distance?: number;
    children?: DndContextProps['children'];
    onDragStart?: DndContextProps['onDragStart'];
    onDragMove?: DndContextProps['onDragMove'];
    onDragEnd?: DndContextProps['onDragEnd'];
};

export function DraggableWrapper({ children, onDragStart, onDragMove, onDragEnd, distance = 2 }: DraggableWrapperProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: distance, // 8px
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                distance: distance, // 8px
            },
        })
    );

    const preventScroll = useCallback((event: TouchEvent) => {
        event.preventDefault();
    }, []);
    /** 
    useEffect(() => {
        return () => {
            document.removeEventListener('touchmove', preventScroll);
        };
    }, []);
    */
    return (
        <DndContext
            sensors={sensors}
            onDragStart={(event) => {
                document.body.style.overflow = 'hidden'; // Nonaktifkan scroll
                document.addEventListener('touchmove', preventScroll, {
                    passive: false,
                });
                onDragStart?.(event);
            }}
            onDragMove={onDragMove}
            onDragEnd={(event) => {
                document.body.style.overflow = ''; // Aktifkan kembali scroll
                document.removeEventListener('touchmove', preventScroll);
                onDragEnd?.(event);
            }}
        >
            {children}
        </DndContext>
    );
}
