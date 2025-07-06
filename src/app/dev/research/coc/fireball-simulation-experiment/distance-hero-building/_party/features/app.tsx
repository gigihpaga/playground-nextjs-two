'use client';

import React, { useState, useRef } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';

const BALL_RADIUS = 50;
const WRAPPER_WIDTH = window.innerWidth / 2;
const WRAPPER_HEIGHT = window.innerHeight;
const TOTAL_BALLS = 2; // Bisa diubah sesuai kebutuhan

const INIT_BALL: BallState[] = Array.from({ length: TOTAL_BALLS }, (_, i) => ({
    id: `ball${i}`,
    x: Math.random() * (WRAPPER_WIDTH - BALL_RADIUS * 2) + BALL_RADIUS,
    y: Math.random() * (WRAPPER_HEIGHT - BALL_RADIUS * 2) + BALL_RADIUS,
    color: i % 2 === 0 ? 'red' : 'yellow',
}));

const INIT_BALL2: BallState[] = [
    //
    { id: 'aa', x: 50, y: 50, color: 'red' },
    // { id: 'bb', x: 50, y: 50, color: 'yellow' },
];

interface BallState {
    id: string;
    x: number;
    y: number;
    color: string;
}

interface MoveLog {
    ballId: string;
    relativeX: number;
    relativeY: number;
}

const Ball: React.FC<{ ball: BallState; onDragEnd: (id: string, x: number, y: number) => void }> = ({ ball, onDragEnd }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: ball.id,
    });

    const x = (transform?.x || 0) + ball.x;
    const y = (transform?.y || 0) + ball.y;

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
                position: 'absolute',
                left: x - BALL_RADIUS,
                top: y - BALL_RADIUS,
                width: BALL_RADIUS * 2,
                height: BALL_RADIUS * 2,
                backgroundColor: ball.color,
                borderRadius: '50%',
                cursor: 'grab',
            }}
            onMouseUp={() => onDragEnd(ball.id, x, y)}
        >
            <div className="absolute top-[50%] left-[50%] text-3xs">
                <p>id: ${ball.id}</p>
                <p>x: ${ball.x}</p>
                <p>y: ${ball.y}</p>
            </div>
        </div>
    );
};

/** CollisionApp */
export const App: React.FC = () => {
    const [balls, setBalls] = useState<BallState[]>(() => INIT_BALL2);

    const [history, setHistory] = useState<MoveLog[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleDragEnd = (id: string, newX: number, newY: number) => {
        setBalls((prevBalls) => {
            const newBalls = prevBalls.map((ball) => (ball.id === id ? { ...ball, x: newX, y: newY } : ball));

            // Deteksi tabrakan dengan bola lain
            const activeBall = newBalls.find((ball) => ball.id === id);
            if (!activeBall) return newBalls;

            const collidedBalls = newBalls.filter((ball) => ball.id !== id && areCirclesColliding(activeBall, ball));

            // Update warna bola yang bertabrakan
            return newBalls.map((ball) =>
                ball.id === id || collidedBalls.some((cb) => cb.id === ball.id)
                    ? { ...ball, color: 'rgba(255, 105, 180, 0.5)' } // Pink transparan
                    : { ...ball, color: ball.id.includes('ball0') ? 'red' : 'yellow' }
            );
        });

        // Simpan posisi relatif ke wrapper
        if (wrapperRef.current) {
            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const relativeX = newX - wrapperRect.left;
            const relativeY = newY - wrapperRect.top;

            setHistory((prevHistory) => [...prevHistory, { ballId: id, relativeX, relativeY }]);
        }
    };

    // Fungsi untuk mengecek apakah dua lingkaran bersinggungan
    const areCirclesColliding = (ball1: BallState, ball2: BallState) => {
        const dx = ball2.x - ball1.x;
        const dy = ball2.y - ball1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= BALL_RADIUS * 2;
    };

    console.log('ball state:', balls);

    return (
        <DndContext>
            <div>
                {/* Wrapper */}
                <div
                    ref={wrapperRef}
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

                {/* Log Pergerakan */}
                <div
                    className="absolute left-0 top-[10%]"
                    style={{
                        // marginTop: WRAPPER_HEIGHT + 20,
                        padding: '10px',
                    }}
                >
                    <h3>Log Pergerakan:</h3>
                    <button onClick={() => setHistory((prev) => [])}>clear</button>
                    <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {history.map((log, idx) => (
                            <li key={idx}>
                                Bola {log.ballId} → x: {log.relativeX.toFixed(2)}, y: {log.relativeY.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </DndContext>
    );
};
