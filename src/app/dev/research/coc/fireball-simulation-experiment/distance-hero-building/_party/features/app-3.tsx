'use client';

import React, { useState } from 'react';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';

const BALL_RADIUS = 50;
const WRAPPER_WIDTH = window.innerWidth / 2;
const WRAPPER_HEIGHT = window.innerHeight;

interface BallState {
    id: string;
    x: number;
    y: number;
    color: string;
}

const Ball: React.FC<{ ball: BallState }> = ({ ball }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: ball.id });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
                position: 'absolute',
                left: ball.x + (transform?.x || 0),
                top: ball.y + (transform?.y || 0),
                width: BALL_RADIUS * 2,
                height: BALL_RADIUS * 2,
                backgroundColor: ball.color,
                borderRadius: '50%',
                cursor: 'grab',
                transition: 'transform 0.1s ease-out',
            }}
        />
    );
};

export const App3: React.FC = () => {
    const [balls, setBalls] = useState<BallState[]>([
        { id: 'ball1', x: 100, y: 200, color: 'red' },
        { id: 'ball2', x: 300, y: 400, color: 'yellow' },
    ]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { id } = event.active;
        const { x, y } = event.delta;

        console.log('handleDragEnd', { id, x, y });

        setBalls((prevBalls) => prevBalls.map((ball) => (ball.id === id ? { ...ball, x: ball.x + x, y: ball.y + y } : ball)));
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div
                style={{
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    width: WRAPPER_WIDTH,
                    height: WRAPPER_HEIGHT,
                    backgroundColor: '#f0f0f0',
                    borderLeft: '2px solid black',
                    overflow: 'hidden',
                }}
            >
                {balls.map((ball) => (
                    <Ball
                        key={ball.id}
                        ball={ball}
                    />
                ))}
            </div>
        </DndContext>
    );
};
