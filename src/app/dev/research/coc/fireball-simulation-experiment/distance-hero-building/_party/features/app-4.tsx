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

/**
 * drag and drop memperbarui posisi dan mendeteksi persinggungan lingkaran
 * @returns
 */
export const App4: React.FC = () => {
    const [balls, setBalls] = useState<BallState[]>([
        { id: 'ball1', x: 100, y: 200, color: 'red' },
        { id: 'ball2', x: 300, y: 400, color: 'yellow' },
        { id: 'ball3', x: 150, y: 350, color: 'blue' },
    ]);

    // Fungsi untuk mendeteksi persinggungan antar bola
    const detectCollision = (id: string, newX: number, newY: number) => {
        return balls.map((ball) => {
            if (ball.id === id) return ball; // Jangan cek bola dengan dirinya sendiri
            const distance = Math.sqrt((ball.x - newX) ** 2 + (ball.y - newY) ** 2);
            if (distance < BALL_RADIUS * 2) {
                return { ...ball, color: 'rgba(255, 192, 203, 0.5)' }; // Warna pink transparan
            }
            return { ...ball, color: ball.id === 'ball1' ? 'red' : ball.id === 'ball2' ? 'yellow' : 'blue' };
        });
    };

    // Update posisi saat drag selesai
    const handleDragEnd = (event: any) => {
        const { id } = event.active;
        const { x, y } = event.delta;

        setBalls((prevBalls) => {
            return prevBalls.map((ball) => (ball.id === id ? { ...ball, x: ball.x + x, y: ball.y + y } : ball));
        });
    };

    // Update warna saat bola sedang di-drag
    const handleDragMove = (event: any) => {
        const { id } = event.active;
        const { x, y } = event.delta;

        setBalls((prevBalls) => detectCollision(id, prevBalls.find((b) => b.id === id)!.x + x, prevBalls.find((b) => b.id === id)!.y + y));
    };

    console.log('App4 RENDER !!!');

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
