'use client';
import { useCallback } from 'react';
import {
    ReactFlowProvider,
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    Panel,
    addEdge,
    MarkerType,
    Position,
    useEdgesState,
    useNodesState,
    useStore,
    useStoreApi,
    useReactFlow,
} from '@xyflow/react';
import type { ColorMode, Node, Edge, Connection, NodeTypes, EdgeTypes, ReactFlowInstance, ReactFlowJsonObject, ReactFlowProps } from '@xyflow/react';

import { initNodes, initEdges } from '../../constants/init-nodes-edges';
import { BaseFlow, type RFProps } from '../../components/flow/rf-base';
import { Button } from '@/components/ui/button';
import { CustomEdgeType, SelectCustomNode } from '../../components/flow/custom-types';

const basicNewEdge = {
    animated: true,
    type: 'CustomEdge',
    markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: '#88ff00',
    },
};

export function FlowXSelf() {
    const [nodes, setNodes, onNodesChange] = useNodesState([...initNodes]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([...initEdges]);
    const onConnect = useCallback(
        (connection: Connection) => {
            const edge: CustomEdgeType = {
                ...basicNewEdge,
                type: 'default',
                ...connection,
                id: `${connection.source}__${connection.target}`,
            };
            setEdges((prev) => addEdge<CustomEdgeType>(edge, prev));
        },
        [setEdges]
    );

    return (
        <BaseFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
        >
            <Panel position="top-left">
                <div className="bg-yellow-500">
                    <Button
                        size="sm"
                        className="h-7"
                        onClick={() => {
                            const newNode: SelectCustomNode<'NodeShape'> = {
                                id: `${nodes.length + 1}-new-data`,
                                // type: 'CardCommited',
                                type: 'NodeShape',
                                data: {
                                    text: 'group file',
                                    theme: 'yellow',
                                    shapeType: 'circle',
                                    positionHandle: {
                                        source: Position.Right,
                                        target: Position.Left,
                                    },
                                },
                                position: { x: 0, y: 0 },
                            };
                            setNodes((prevs) => {
                                return [...prevs, newNode];
                            });
                        }}
                    >
                        Add comitted non group
                    </Button>
                </div>
            </Panel>
        </BaseFlow>
    );
}
