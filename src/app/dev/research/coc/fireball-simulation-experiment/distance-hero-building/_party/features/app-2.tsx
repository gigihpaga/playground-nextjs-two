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

const Ball: React.FC<{ ball: BallState; onDragEnd: (id: string, x: number, y: number) => void }> = ({ ball, onDragEnd }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: ball.id });

    const translateX = transform ? transform.x : 0;
    const translateY = transform ? transform.y : 0;

    console.log('Ball', { translateX, translateY });

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
                position: 'absolute',
                left: ball.x + translateX,
                top: ball.y + translateY,
                width: BALL_RADIUS * 2,
                height: BALL_RADIUS * 2,
                backgroundColor: ball.color,
                borderRadius: '50%',
                cursor: 'grab',
                transition: 'transform 0.1s ease-out',
            }}
            onMouseUp={() => onDragEnd(ball.id, ball.x + translateX, ball.y + translateY)}
        >
            <div className="absolute top-[50%] left-[50%] text-3xs">
                <p>id: {ball.id}</p>
                <p>x: {ball.x}</p>
                <p>y: {ball.y}</p>
            </div>
        </div>
    );
};

export const App2: React.FC = () => {
    const [balls, setBalls] = useState<BallState[]>([
        { id: 'ball1', x: 100, y: 200, color: 'red' },
        { id: 'ball2', x: 300, y: 400, color: 'yellow' },
    ]);

    const handleDragEnd = (id: string, newX: number, newY: number) => {
        setBalls((prevBalls) => {
            // return prevBalls.map((ball) => (ball.id === id ? { ...ball, x: newX, y: newY } : ball));
            console.log('handleDragEnd', { id, newX, newY });
            return prevBalls.map((ball) => {
                if (id === ball.id) {
                    const oldBall = ball;

                    return {
                        ...oldBall,
                        x: newX,
                        y: newY,
                    };
                }
                return ball;
            });
        });
    };

    console.log('ball state', balls);

    return (
        <DndContext>
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
                        onDragEnd={handleDragEnd}
                    />
                ))}
            </div>
        </DndContext>
    );
};
