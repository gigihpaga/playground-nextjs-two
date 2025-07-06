'use client';

// v2 - Menghapus @xyflow, menambahkan custom panning, zoom, dan fit content

import React, { useState, useRef } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

const BoardSize = 500; // Ukuran board 500x500
const GridSize = 10; // Grid 10x10

export function New2() {
    const [balls, setBalls] = useState([{ id: 1, x: 100, y: 100 }]);
    const [scale, setScale] = useState(1); // Zoom state
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Panning state
    const viewportRef = useRef<HTMLDivElement>(null);

    // Handle zoom
    const handleZoom = (delta: number) => {
        setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 2)); // Batas zoom antara 0.5x - 2x
    };

    // Handle panning (drag viewport)
    const handleMouseDown = (event: React.MouseEvent) => {
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

    // Handle fit content (reset viewport)
    const handleFitContent = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-gray-900">
            {/* Background Infinite */}
            <div className="absolute inset-0 bg-grid-gray-700 [mask-image:linear-gradient(white,transparent)]"></div>

            {/* Viewport */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
                ref={viewportRef}
                className="absolute inset-0 flex items-center justify-center"
                onMouseDown={handleMouseDown}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: 'center',
                    cursor: 'grab',
                }}
            >
                <DndContext onDragEnd={(event) => console.log(event)}>
                    {/* Board */}
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
                        {/* Balls */}
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

            {/* Controls */}
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

// Komponen Ball dengan drag-and-drop menggunakan dnd-kit
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
