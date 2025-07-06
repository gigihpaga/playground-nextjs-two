// v2 - Perbaikan: Next.js client, Tailwind, TypeScript types, export non-default, drag end update

'use client';

import React, { useState } from 'react';
import { useDraggable, DndContext, DragEndEvent } from '@dnd-kit/core';

const GRID_SIZE = 10;
const BOARD_SIZE = 50 * GRID_SIZE;

interface Position {
    x: number;
    y: number;
}

interface NodeProps {
    id: string;
    type: 'building' | 'spell';
    position: Position;
    onDragEnd: (event: DragEndEvent) => void;
}

const Node: React.FC<NodeProps> = ({ id, type, position, onDragEnd }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    const style = `absolute ${type === 'spell' ? 'rounded-full bg-blue-400/60' : 'bg-pink-400/60'}`;

    return (
        <div
            ref={setNodeRef}
            className={style}
            style={{
                left: position.x,
                top: position.y,
                width: type === 'building' ? 3 * GRID_SIZE : 4.7 * 2 * GRID_SIZE,
                height: type === 'building' ? 3 * GRID_SIZE : 4.7 * 2 * GRID_SIZE,
                transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : 'none',
            }}
            {...listeners}
            {...attributes}
        />
    );
};

const Board: React.FC = () => {
    const [nodes, setNodes] = useState<NodeProps[]>([
        { id: 'b1', type: 'building', position: { x: 100, y: 100 }, onDragEnd: () => {} },
        { id: 's1', type: 'spell', position: { x: 200, y: 200 }, onDragEnd: () => {} },
    ]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        setNodes((prev) =>
            prev.map((node) => (node.id === active.id ? { ...node, position: { x: node.position.x + delta.x, y: node.position.y + delta.y } } : node))
        );
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="relative w-[500px] h-[500px] bg-grid bg-gray-100">
                {nodes.map((node) => (
                    <Node
                        key={node.id}
                        {...node}
                        onDragEnd={handleDragEnd}
                    />
                ))}
            </div>
        </DndContext>
    );
};

export function App() {
    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-300">
            <Board />
        </div>
    );
}
