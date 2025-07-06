'use client';

import React, { useState } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';

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

const InfiniteBackground: React.FC = () => {
    return (
        <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
        >
            <defs>
                <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                >
                    <circle
                        cx="20"
                        cy="20"
                        r="2"
                        fill="#ccc"
                    />
                </pattern>
            </defs>
            <rect
                width="100%"
                height="100%"
                fill="url(#grid)"
            />
        </svg>
    );
};

const InfiniteBackground2: React.FC = () => {
    return (
        <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
        >
            <defs>
                <pattern
                    id="grid"
                    width="5"
                    height="5"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M 5 0 L 0 0 0 5"
                        fill="none"
                        stroke="black"
                        strokeWidth="1"
                    />
                </pattern>
            </defs>
            <rect
                width="100%"
                height="100%"
                fill="url(#grid)"
            />
        </svg>
    );
};

/**
 * menambah backgroud
 * @returns
 */
export const App5: React.FC = () => {
    const [balls, setBalls] = useState<BallState[]>([
        { id: 'ball1', x: 100, y: 200, color: 'red' },
        { id: 'ball2', x: 300, y: 400, color: 'yellow' },
        { id: 'ball3', x: 150, y: 350, color: 'blue' },
    ]);

    const detectCollision = (id: string, newX: number, newY: number) => {
        return balls.map((ball) => {
            if (ball.id === id) return ball;
            const distance = Math.sqrt((ball.x - newX) ** 2 + (ball.y - newY) ** 2);
            if (distance < BALL_RADIUS * 2) {
                return { ...ball, color: 'rgba(255, 192, 203, 0.5)' };
            }
            return { ...ball, color: ball.id === 'ball1' ? 'red' : ball.id === 'ball2' ? 'yellow' : 'blue' };
        });
    };

    const handleDragEnd = (event: any) => {
        const { id } = event.active;
        const { x, y } = event.delta;

        setBalls((prevBalls) => prevBalls.map((ball) => (ball.id === id ? { ...ball, x: ball.x + x, y: ball.y + y } : ball)));
    };

    const handleDragMove = (event: any) => {
        const { id } = event.active;
        const { x, y } = event.delta;

        setBalls((prevBalls) => detectCollision(id, prevBalls.find((b) => b.id === id)!.x + x, prevBalls.find((b) => b.id === id)!.y + y));
    };

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
        >
            <div
                style={{
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    width: WRAPPER_WIDTH,
                    height: WRAPPER_HEIGHT,
                    overflow: 'auto',
                    borderLeft: '2px solid black',
                }}
            >
                <InfiniteBackground2 />
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
