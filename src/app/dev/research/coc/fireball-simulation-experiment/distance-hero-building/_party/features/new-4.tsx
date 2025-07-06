'use client';

// v4 - Bola tetap di lokasi setelah dilepas

import React, { useState, useRef } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

const BoardSize = 500;
const GridSize = 10;

export function New4() {
    const [balls, setBalls] = useState([{ id: 1, x: 100, y: 100 }]);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const viewportRef = useRef<HTMLDivElement>(null);

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
                    onDragEnd={(event) => {
                        setIsDragging(false);

                        // Update posisi bola setelah dilepas
                        const { active, delta } = event;
                        setBalls((prevBalls) =>
                            prevBalls.map((ball) => (ball.id === active.id ? { ...ball, x: ball.x + delta.x, y: ball.y + delta.y } : ball))
                        );
                    }}
                >
                    <div
                        className="relative border border-gray-600"
                        style={{
                            width: BoardSize,
                            height: BoardSize,
                            backgroundSize: `${GridSize}px ${GridSize}px`,
                            backgroundImage:
                                'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        }}
                    >
                        {balls.map((ball) => (
                            <Ball
                                key={ball.id}
                                id={ball.id}
                                x={ball.x}
                                y={ball.y}
                            />
                        ))}
                    </div>
                </DndContext>
            </div>

            <div className="absolute bottom-4 left-4 flex gap-2">
                <button
                    onClick={() => handleZoom(0.1)}
                    className="p-2 bg-blue-500 text-white"
                >
                    Zoom In
                </button>
                <button
                    onClick={() => handleZoom(-0.1)}
                    className="p-2 bg-blue-500 text-white"
                >
                    Zoom Out
                </button>
                <button
                    onClick={handleFitContent}
                    className="p-2 bg-blue-500 text-white"
                >
                    Fit Content
                </button>
            </div>
        </div>
    );
}

function Ball({ id, x, y }: { id: number; x: number; y: number }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    return (
        <motion.div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="absolute w-10 h-10 bg-red-500 rounded-full"
            style={{
                left: x + (transform?.x || 0),
                top: y + (transform?.y || 0),
            }}
        />
    );
}
