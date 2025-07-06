// v6
// Perbaikan logika checkCollisions
'use client';

import React, { useState } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { createPortal } from 'react-dom';

const GRID_SIZE = 10;
const BOARD_SIZE = 50 * GRID_SIZE;

const initialNodes: NodeProps[] = [
    { id: 'b1', type: 'building', position: { x: 20, y: 20 }, size: 3 },
    { id: 's1', type: 'spell', position: { x: 200, y: 200 }, size: 4.7 },
];

type NodeProps = {
    id: string;
    type: 'building' | 'spell';
    position: { x: number; y: number };
    size: number;
    isColliding?: boolean;
};

const checkCollisions = (nodes: NodeProps[]) => {
    const spell = nodes.find((node) => node.type === 'spell');
    if (!spell) return nodes;

    return nodes.map((node) => {
        if (node.type === 'building') {
            const spellRadius = spell.size / 2;
            const buildingSize = node.size;

            // Pusat lingkaran (Spell)
            const Cx = spell.position.x + spellRadius;
            const Cy = spell.position.y + spellRadius;

            // Batas kotak (Building)
            const L = node.position.x;
            const R = node.position.x + buildingSize;
            const T = node.position.y;
            const B = node.position.y + buildingSize;

            // Titik terdekat pada kotak ke pusat lingkaran
            const Nx = Math.max(L, Math.min(Cx, R));
            const Ny = Math.max(T, Math.min(Cy, B));

            // Hitung jarak antara pusat lingkaran dan titik terdekat
            const dx = Cx - Nx;
            const dy = Cy - Ny;
            const distance = Math.sqrt(dx * dx + dy * dy);

            return {
                ...node,
                isColliding: distance < spellRadius,
            };
        }
        return node;
    });
};

const Node = ({ node }: { node: NodeProps }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: node.id });
    const style = {
        width: node.size,
        height: node.size,
        borderRadius: node.type === 'spell' ? '50%' : '0%',
        left: node.position.x + (transform?.x || 0),
        top: node.position.y + (transform?.y || 0),
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`absolute ${node.type === 'building' ? 'bg-pink-500' : 'bg-blue-500'} opacity-60 ${node.isColliding ? 'bg-gray-500' : ''}`}
            style={style}
        />
    );
};

const Board = ({ nodes }: { nodes: NodeProps[] }) => {
    return (
        <div
            className="relative"
            style={{
                width: BOARD_SIZE,
                height: BOARD_SIZE,
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                backgroundImage:
                    'linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
            }}
        >
            {nodes.map((node) => (
                <Node
                    key={node.id}
                    node={node}
                />
            ))}
        </div>
    );
};

const App = () => {
    const [nodes, setNodes] = useState<NodeProps[]>(initialNodes);

    const handleDragEnd = (event: any) => {
        const { active, delta } = event;
        setNodes((prevNodes) => {
            const updatedNodes = prevNodes.map((node) =>
                node.id === active.id ? { ...node, position: { x: node.position.x + delta.x, y: node.position.y + delta.y } } : node
            );
            return checkCollisions(updatedNodes);
        });
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="relative w-screen h-screen flex justify-center items-center bg-gray-100">
                <Board nodes={nodes} />
            </div>
        </DndContext>
    );
};

export { App };
