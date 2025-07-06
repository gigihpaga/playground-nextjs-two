// v1 - Implementasi awal COC Detect Collision Invisible Spell
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDraggable, DndContext, DragEndEvent } from '@dnd-kit/core';

const GRID_SIZE = 10;
const BOARD_SIZE = 50 * GRID_SIZE;
const NODE_TYPES = {
    BUILDING: 'building',
    SPELL: 'spell',
} as const;

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

const Node = ({ id, type, position, onDragEnd }: NodeProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });

    const style: React.CSSProperties = {
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: type === NODE_TYPES.BUILDING ? 3 * GRID_SIZE : 4.7 * 2 * GRID_SIZE,
        height: type === NODE_TYPES.BUILDING ? 3 * GRID_SIZE : 4.7 * 2 * GRID_SIZE,
        backgroundColor: type === NODE_TYPES.BUILDING ? 'rgba(255, 192, 203, 0.6)' : 'rgba(0, 0, 255, 0.6)',
        borderRadius: type === NODE_TYPES.SPELL ? '50%' : '0%',
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        />
    );
};

const Board = () => {
    const [nodes, setNodes] = useState([
        { id: 'b1', type: NODE_TYPES.BUILDING, position: { x: 100, y: 100 } },
        { id: 's1', type: NODE_TYPES.SPELL, position: { x: 200, y: 200 } },
    ]);

    return (
        <DndContext>
            <div
                style={{
                    width: BOARD_SIZE,
                    height: BOARD_SIZE,
                    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                    backgroundImage:
                        'linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px), ' +
                        'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
                    position: 'relative',
                }}
            >
                {nodes.map((node) => (
                    <Node
                        key={node.id}
                        {...node}
                    />
                ))}
            </div>
        </DndContext>
    );
};

export function App() {
    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#ddd',
            }}
        >
            <Board />
        </div>
    );
}
