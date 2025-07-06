// v4 - Memperbaiki dragging yang tidak berfungsi setelah deteksi tabrakan

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
    onDragEnd?: (event: DragEndEvent) => void;
    isColliding?: boolean;
}

const Node: React.FC<NodeProps> = ({ id, type, position, onDragEnd, isColliding }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    const style = `absolute ${type === 'spell' ? 'rounded-full' : ''} ${
        isColliding ? 'bg-gray-400/60' : type === 'spell' ? 'bg-blue-400/60' : 'bg-pink-400/60'
    }`;

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
        { id: 'b1', type: 'building', position: { x: 100, y: 100 } },
        { id: 's1', type: 'spell', position: { x: 200, y: 200 } },
    ]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        setNodes((prev) =>
            prev.map((node) => (node.id === active.id ? { ...node, position: { x: node.position.x + delta.x, y: node.position.y + delta.y } } : node))
        );
    };

    // Fungsi untuk mengecek apakah ada tabrakan antara spell dan building
    const checkCollisions = (nodes: NodeProps[]) => {
        const spell = nodes.find((node) => node.type === 'spell');
        if (!spell) return nodes;

        return nodes.map((node) => {
            if (node.type === 'building') {
                const dx = spell.position.x - node.position.x;
                const dy = spell.position.y - node.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const spellRadius = 4.7 * GRID_SIZE;
                const buildingSize = 3 * GRID_SIZE;
                return {
                    ...node,
                    isColliding: distance < spellRadius + buildingSize / 2,
                };
            }
            return node;
        });
    };

    const updatedNodes = checkCollisions(nodes);

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="relative w-[500px] h-[500px] bg-grid bg-gray-100">
                {updatedNodes.map((node) => (
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
