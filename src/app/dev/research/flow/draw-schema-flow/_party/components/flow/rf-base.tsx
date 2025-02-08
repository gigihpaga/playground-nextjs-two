'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState, JSX } from 'react';

import { useTheme } from 'next-themes';
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

import { nodeTypes, edgeTypes, CustomNodeType, CustomEdgeType } from './custom-types';

export type RFProps = ReactFlowProps & React.RefAttributes<HTMLDivElement>;
type ButtonProps = JSX.IntrinsicElements['button'];

export const BaseFlow = React.forwardRef<HTMLDivElement, ReactFlowProps<CustomNodeType, CustomEdgeType>>(({ children, ...props }, ref) => {
    const nextTheme = useTheme();
    return (
        <ReactFlow
            ref={ref}
            colorMode={nextTheme.theme as ColorMode}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            minZoom={0.001}
            maxZoom={4}
            fitView
            {...props}
        >
            {children}
        </ReactFlow>
    );
});
BaseFlow.displayName = 'BaseFlow';
