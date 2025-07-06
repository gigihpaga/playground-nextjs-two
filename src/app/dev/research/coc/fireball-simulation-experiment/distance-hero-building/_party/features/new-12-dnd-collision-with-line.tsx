'use client';

// v12 - copy dari v10 Menambahkan Snap to Grid

import React, { useState, useRef, ReactHTML } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

const BOARD_SIZE = 500;
const GRID_SIZE = 10;
const ENTITY_SIZE = 40;

type EntityType = 'hero' | 'building';

type EntityShape = { id: number; x: number; y: number; type: EntityType };

export function New12() {
    const [entities, setBalls] = useState<EntityShape[]>([
        { id: 1, x: 0, y: 10, type: 'hero' },
        { id: 2, x: 120, y: 10, type: 'building' },
        { id: 3, x: 300, y: 250, type: 'building' },
    ]);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const viewportRef = useRef<HTMLDivElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);
    const EntityDraggingTemp = useRef<EntityShape | null>(null);

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

    console.log('isDragging', isDragging);

    const hero = entities.find((b) => b.type === 'hero');
    const building = entities.filter((b) => b.type === 'building');

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
                    onDragStart={(event) => {
                        setIsDragging(true);
                        const ballActive = entities.find((ball) => ball.id === event.active.id);
                        if (!ballActive) return;
                        EntityDraggingTemp.current = ballActive;
                    }}
                    onDragMove={(event) => {
                        const { active, delta } = event;

                        const entityTemp = EntityDraggingTemp.current;

                        if (!entityTemp) return;

                        setBalls((prevBalls) => {
                            return prevBalls.map((ball) => {
                                if (ball.id === active.id) {
                                    const boardRect = boardRef.current?.getBoundingClientRect();
                                    if (!boardRect) return ball;

                                    // let newX = ball.x + delta.x;
                                    // let newY = ball.y + delta.y;
                                    let newX = entityTemp.x + delta.x;
                                    let newY = entityTemp.y + delta.y;

                                    // sebelum snap to grid
                                    // newX = Math.max(0, Math.min(newX, BoardSize - BallSize));
                                    // newY = Math.max(0, Math.min(newY, BoardSize - BallSize));
                                    // snap to grid
                                    newX = Math.min(Math.round(newX / GRID_SIZE) * GRID_SIZE, BOARD_SIZE - ENTITY_SIZE);
                                    // Math.min(Math.round((ball.x + delta.x) / GridSize) * GridSize, BoardSize - BallSize)
                                    newY = Math.min(Math.round(newY / GRID_SIZE) * GRID_SIZE, BOARD_SIZE - ENTITY_SIZE);

                                    // console.log('onDragMove', { ballTemp, delta, newX, newY });
                                    // console.log('onDragMove', 'x', newX, 'y', newY);
                                    return { ...ball, x: newX, y: newY };
                                }
                                return ball;
                            });
                        });
                    }}
                    onDragEnd={(event) => {
                        setIsDragging(false);
                        EntityDraggingTemp.current = null;
                    }}
                >
                    <div
                        ref={boardRef}
                        className="relative border border-gray-600"
                        style={{
                            width: BOARD_SIZE,
                            height: BOARD_SIZE,
                            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                            backgroundImage:
                                'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        }}
                    >
                        <svg className="absolute w-full h-full">
                            {hero &&
                                building.map((enemy) => {
                                    const dx = enemy.x - hero.x;
                                    const dy = enemy.y - hero.y;
                                    const distance = Math.sqrt(dx * dx + dy * dy).toFixed(1);
                                    return (
                                        <g
                                            key={enemy.id}
                                            data-name={`${enemy.id}-${enemy.type}`}
                                        >
                                            <line
                                                x1={hero.x + ENTITY_SIZE / 2}
                                                y1={hero.y + ENTITY_SIZE / 2}
                                                x2={enemy.x + ENTITY_SIZE / 2}
                                                y2={enemy.y + ENTITY_SIZE / 2}
                                                stroke="white"
                                                strokeWidth="1"
                                            />
                                            <text
                                                x={(hero.x + enemy.x) / 2 + ENTITY_SIZE / 2}
                                                y={(hero.y + enemy.y) / 2 + ENTITY_SIZE / 2}
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
                        {entities.map((ball) => (
                            <EntityView
                                key={ball.id}
                                id={ball.id}
                                x={ball.x}
                                y={ball.y}
                                type={ball.type}
                                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
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

type EntityViewProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> & EntityShape;

function EntityView({ id, x, y, type, style }: EntityViewProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    return (
        <motion.div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`absolute w-10 h-10 rounded-full ${type === 'hero' ? 'bg-blue-500' : 'bg-red-500'}`}
            style={{
                // left: x + (transform?.x || 0), // <=== ini yang menyebabkan ui tidak sinkron dengan state
                // top: y + (transform?.y || 0), // <=== ini yang menyebabkan ui tidak sinkron dengan state
                ...style,
                left: x,
                top: y,
            }}
        />
    );
}
