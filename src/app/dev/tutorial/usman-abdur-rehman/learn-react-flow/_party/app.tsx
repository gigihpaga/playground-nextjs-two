'use client';
import React, { useCallback, useState } from 'react';
import { useTheme } from 'next-themes';
import { RefreshCcwIcon } from 'lucide-react';

import '@xyflow/react/dist/style.css';
import { Background, Controls, MiniMap, ReactFlow, Panel, addEdge, useEdgesState, useNodesState, MarkerType, useReactFlow } from '@xyflow/react';
import type { ColorMode, Node, Edge, Connection, NodeTypes, EdgeTypes } from '@xyflow/react';

import { initialEdges, initialNodes } from './components/data-workflow';
import { PaymentInit, PaymentCountry, PaymentProvider, PaymentProviderSelect, CustomEdge } from './components';
import { Button } from '@/components/ui/button';

const nodeTypes: NodeTypes = {
    'paymentInit': PaymentInit,
    'paymentCountry': PaymentCountry,
    'paymentProvider': PaymentProvider,
    'paymentProviderSelect': PaymentProviderSelect,
};

const edgeTypes: EdgeTypes = {
    'customEdge': CustomEdge,
};

export function App() {
    const nextTheme = useTheme();

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (connection: Connection) => {
            const edge: Edge = {
                ...connection,
                animated: true,
                id: `${connection.source}-${connection.target}`,
                type: 'customEdge',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                },
            }; /* satisfies Connection & Edge */
            setEdges((prev) => addEdge(edge, prev));
        },
        [setEdges]
    );

    console.log('edges', edges);

    return (
        <div className="container">
            <div
                className="_bg-red-600 border text-black  _dark:text-background"
                style={{ height: '75vh' /* width: '50vw' */ }}
                aria-description="react flow wrapper"
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    colorMode={nextTheme.theme as ColorMode}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                >
                    <Panel position="top-left">
                        <div className="flex gap-x-2">
                            <PaymentProviderSelect />
                            <Button
                                size="icon"
                                className="size-6"
                                onClick={() => {
                                    setNodes(initialNodes);
                                    setEdges(initialEdges);
                                }}
                            >
                                <RefreshCcwIcon className="size-4" />
                            </Button>
                            <Checking />
                        </div>
                    </Panel>
                    <Background />
                    <Controls />
                    {/* <MiniMap /> */}
                </ReactFlow>
            </div>
        </div>
    );
}

function Checking() {
    const { addNodes, setNodes, getNode, getNodes } = useReactFlow();
    return (
        <Button
            onClick={() => {
                const allNodes = getNodes();
                console.log({ allNodes });
            }}
        >
            check
        </Button>
    );
}
