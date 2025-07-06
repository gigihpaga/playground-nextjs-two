'use client';

// v7 - Line-distance diperbarui secara real-time

import React, { useState, useRef } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

const BoardSize = 500;
const GridSize = 10;
const BallSize = 40;

export function New7() {
    const [balls, setBalls] = useState([
        { id: 1, x: 100, y: 100, type: 'gladiator' },
        { id: 2, x: 200, y: 150, type: 'enemy' },
        { id: 3, x: 300, y: 250, type: 'enemy' },
    ]);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const viewportRef = useRef<HTMLDivElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    const handleZoom = (delta: number) => {
        setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 2));
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        if (isDragging) return;
        const startX = event.clientX;
        const startY = event.clientY;
        const startPos = { ...position };

        const handleMouseMove = (moveEvent: MouseEvent) => {
            setPosition({
                x: startPos.x + (moveEvent.clientX - startX),
                y: startPos.y + (moveEvent.clientY - startY),
            });
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleFitContent = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const gladiator = balls.find((b) => b.type === 'gladiator');
    const enemies = balls.filter((b) => b.type === 'enemy');

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-grid-gray-700 [mask-image:linear-gradient(white,transparent)]"></div>

            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
                ref={viewportRef}
                className="absolute inset-0 flex items-center justify-center"
                onMouseDown={handleMouseDown}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: 'center',
                    cursor: isDragging ? 'default' : 'grab',
                }}
            >
                <DndContext
                    onDragStart={() => setIsDragging(true)}
                    onDragMove={(event) => {
                        const { active, delta } = event;
                        setBalls((prevBalls) => {
                            return prevBalls.map((ball) => {
                                if (ball.id === active.id) {
                                    return { ...ball, x: ball.x + delta.x, y: ball.y + delta.y };
                                }
                                return ball;
                            });
                        });
                    }}
                    onDragEnd={(event) => {
                        setIsDragging(false);
                        const { active, delta } = event;
                        setBalls((prevBalls) => {
                            return prevBalls.map((ball) => {
                                if (ball.id === active.id) {
                                    const boardRect = boardRef.current?.getBoundingClientRect();
                                    if (!boardRect) return ball;

                                    let newX = ball.x + delta.x;
                                    let newY = ball.y + delta.y;

                                    newX = Math.max(0, Math.min(newX, BoardSize - BallSize));
                                    newY = Math.max(0, Math.min(newY, BoardSize - BallSize));

                                    return { ...ball, x: newX, y: newY };
                                }
                                return ball;
                            });
                        });
                    }}
                >
                    <div
                        ref={boardRef}
                        className="relative border border-gray-600"
                        style={{
                            width: BoardSize,
                            height: BoardSize,
                            backgroundSize: `${GridSize}px ${GridSize}px`,
                            backgroundImage:
                                'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        }}
                    >
                        {/*   <div className="absolute w-full h-full">
                            <svg>
                                {gladiator &&
                                    enemies.map((enemy) => {
                                        const dx = enemy.x - gladiator.x;
                                        const dy = enemy.y - gladiator.y;
                                        const distance = Math.sqrt(dx * dx + dy * dy).toFixed(1);
                                        return (
                                            <g key={enemy.id}>
                                                <line
                                                    x1={gladiator.x + BallSize / 2}
                                                    y1={gladiator.y + BallSize / 2}
                                                    x2={enemy.x + BallSize / 2}
                                                    y2={enemy.y + BallSize / 2}
                                                    stroke="white"
                                                    strokeWidth="1"
                                                />
                                                <text
                                                    x={(gladiator.x + enemy.x) / 2 + BallSize / 2}
                                                    y={(gladiator.y + enemy.y) / 2 + BallSize / 2}
                                                    fill="white"
                                                    fontSize="12"
                                                    textAnchor="middle"
                                                >
                                                    {distance}
                                                </text>
                                            </g>
                                        );
                                    })}
                            </svg>
                        </div> */}
                        {balls.map((ball) => (
                            <Ball
                                key={ball.id}
                                id={ball.id}
                                x={ball.x}
                                y={ball.y}
                                type={ball.type}
                            />
                        ))}
                    </div>
                </DndContext>
            </div>
        </div>
    );
}

function Ball({ id, x, y, type }: { id: number; x: number; y: number; type: string }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    return (
        <motion.div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`absolute w-10 h-10 ${type === 'gladiator' ? 'bg-blue-500' : 'bg-red-500'} rounded-full`}
            style={{
                left: x + (transform?.x || 0),
                top: y + (transform?.y || 0),
            }}
        />
    );
}
