import { Edge, EdgeChange, Node, NodeChange, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges, XYPosition } from '@xyflow/react';
import { create } from 'zustand';
import { createWithEqualityFn } from 'zustand/traditional';
import { nanoid } from 'nanoid/non-secure';
import { shallow } from 'zustand/shallow';
import { CustomEdgeType, CustomNodeType } from '../components/flow/custom-types';

/**
 * https://codesandbox.io/p/sandbox/upbeat-zhukovsky-nrss6l?file=%2Fstore.ts%3A1%2C1-79%2C1&utm_medium=sandpack
 */
export type RFState = {
    nodes: /* Node[] */ CustomNodeType[];
    edges: /* Edge[]  */ CustomEdgeType[];
    onNodesChange: OnNodesChange<CustomNodeType>;
    onEdgesChange: OnEdgesChange<CustomEdgeType>;
    addChildNode: (parentNode: Node, position: XYPosition) => void;
    updateNodeLabel: (nodeId: string, label: string) => void;
};

// const useDrawStore = create<RFState>((set, get) => ({
const useMindmapStore = createWithEqualityFn<RFState>((set, get) => ({
    nodes: [
        {
            id: 'root',
            // @ts-expect-error
            type: 'mindmap',
            data: { label: 'React Flow Mind Map' },
            position: { x: 0, y: 0 },
        },
    ],
    edges: [],
    onNodesChange: (changes: NodeChange<CustomNodeType>[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes: EdgeChange<CustomEdgeType>[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    addChildNode: (parentNode: Node, position: XYPosition) => {
        const newNode = {
            id: nanoid(),
            type: 'mindmap',
            data: { label: 'New Node' },
            position,
            parentId: parentNode.id,
        };

        const newEdge = {
            id: nanoid(),
            source: parentNode.id,
            target: newNode.id,
        };

        set({
            // @ts-expect-error
            nodes: [...get().nodes, newNode],
            edges: [...get().edges, newEdge],
        });
    },
    updateNodeLabel: (nodeId: string, label: string) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    // it's important to create a new object here, to inform React Flow about the changes
                    node.data = { ...node.data, label };
                }

                return node;
            }),
        });
    },
}));

const selectorMindmap = (state: RFState) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    addChildNode: state.addChildNode,
});

export { useMindmapStore, selectorMindmap, shallow };
