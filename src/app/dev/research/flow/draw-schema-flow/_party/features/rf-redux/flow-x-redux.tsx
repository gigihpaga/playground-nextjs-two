'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addNode, onConnect, onEdgesChange, onNodesChange, setEdges, setNodes, getNodes, getEdges } from '../../state/draw-schema-flow-slice';

import { BaseFlow, type RFProps } from '../../components/flow/rf-base';
import { Button } from '@/components/ui/button';
import { PanelTopRight } from './panel-top-right';
import { PanelBotom } from './panel-botom';
import { CustomEdgeType, CustomNodeType } from '../../components/flow/custom-types';
import { NodeShapeData } from '../../components/flow/node-shape';

/**
 * react-flow feat redux 🔃
 * - can moving node ✅
 * - can add node ✅
 * - can change color node ✅
 * - not resize node 🚫
 * https://github.com/xyflow/xyflow/issues/4253#issuecomment-2155856313
 * https://github.com/xyflow/xyflow/issues/2240
 * https://codesandbox.io/p/sandbox/selection-with-redux-reactflow11-forked-fyrfkw?file=%2Fsrc%2Fstate.js%3A20%2C7-20%2C27
 * https://codesandbox.io/p/sandbox/selection-with-redux-reactflow11-mkd4ql
 */
export function FlowXRedux() {
    const nodes = useAppSelector(getNodes);
    const edges = useAppSelector(getEdges);
    const dispatch = useAppDispatch();

    const flowRef = useRef<HTMLDivElement | null>(null);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance<CustomNodeType, CustomEdgeType> | null>(null);

    // const onNodeContextMenu = useCallback((event: React.MouseEvent<Element, MouseEvent>, node: Node) => {}, []);
    // const onPaneClick = useCallback((event: React.MouseEvent<Element, MouseEvent>) => {}, []);

    return (
        <BaseFlow
            // nodes={structuredClone(nodes)}
            ref={flowRef}
            onInit={setRfInstance}
            nodes={nodes}
            edges={edges}
            onNodesChange={(nodes) => dispatch(onNodesChange(nodes))}
            onEdgesChange={(edges) => dispatch(onEdgesChange(edges))}
            onConnect={(conn) => dispatch(onConnect(conn))}
            // onNodeContextMenu={onNodeContextMenu}
            // onPaneClick={onPaneClick}
        >
            <Panel position="top-left">
                <div className="bg-red-500">
                    <Button
                        size="sm"
                        className="h-7"
                        onClick={() => {
                            const newNode = {
                                // id: `${nodes.length + 1}-new-data`,
                                // type: 'CardCommited',
                                // type: 'Shape',
                                data: {
                                    text: 'group file',
                                    theme: 'red',
                                    shapeType: 'square',
                                    positionHandle: {
                                        source: Position.Right,
                                        target: Position.Left,
                                    },
                                } satisfies NodeShapeData,
                                position: { x: 0, y: 0 },
                            };
                            /*  setNodes((prevs) => {
                                    return [...prevs, newNode];
                                }); */
                            dispatch(addNode('NodeShape', newNode));
                        }}
                    >
                        Add comitted non group
                    </Button>
                </div>
            </Panel>
            <Panel position="top-right">
                <PanelTopRight />
            </Panel>
            <Panel position="bottom-center">
                <PanelBotom />
            </Panel>
            <Background />
            <Controls />
        </BaseFlow>
    );
}
