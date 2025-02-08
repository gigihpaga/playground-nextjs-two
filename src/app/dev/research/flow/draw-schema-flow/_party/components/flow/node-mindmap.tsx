'use client';

import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { Handle, Node, NodeProps, NodeResizer, Position } from '@xyflow/react';

import { useMindmapStore } from '../../state/mindmap-store';
import { PartiallyRequired } from '@/types/utilities';

export type NodeMindMapData = { label: string };

export type NodeMindMapProps = PartiallyRequired<Node<NodeMindMapData, 'NodeMindMap'>, 'type'>;

export function NodeMindMap({ id, data, selected }: NodeProps<NodeMindMapProps>) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const updateNodeLabel = useMindmapStore((state) => state.updateNodeLabel);

    useLayoutEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.width = `${data.label.length * 8}px`;
        }
    }, [data.label.length]);

    useEffect(() => {
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus({ preventScroll: true });
            }
        }, 1);
    }, []);

    return (
        <>
            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                minWidth={100}
                minHeight={100}
            />
            <div className="inputWrapper">
                <div className="dragHandle">
                    {/* icon taken from grommet https://icons.grommet.io */}
                    <svg viewBox="0 0 24 24">
                        <path
                            fill="#333"
                            stroke="#333"
                            strokeWidth="1"
                            d="M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z"
                        />
                    </svg>
                </div>
                <input
                    value={data.label}
                    onChange={(evt) => updateNodeLabel(id, evt.target.value)}
                    className="input"
                    ref={inputRef}
                />
            </div>

            <Handle
                type="target"
                position={Position.Top}
                aria-description="oke"
            />
            <Handle
                type="source"
                position={Position.Top}
            />
        </>
    );
}
